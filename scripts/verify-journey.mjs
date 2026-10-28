// Run against an open preview: playwright-cli run-code --filename scripts/verify-journey.mjs
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const origin = new URL(page.url()).origin;
  await page.unroute("**/media/journey/world.geojson");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const seek = async top => {
    await page.evaluate(top => {
      window.scrollTo({ top, behavior: "instant" });
      window.dispatchEvent(new CustomEvent("hr-vista:seek", { detail: top }));
    }, top);
    await page.waitForTimeout(750);
  };
  const open = async () => {
    await page.goto(`${origin}/?journey-qa=${Date.now()}#lavasa`);
    await page.waitForFunction(() => document.documentElement.dataset.intro === "entered");
    await page.locator("#lavasa").waitFor();
    await page.waitForTimeout(400);
  };
  const geometry = () => page.locator("#lavasa").evaluate(el => ({
    top: el.getBoundingClientRect().top + scrollY,
    range: el.offsetHeight - innerHeight,
  }));
  const state = () => page.locator("#lavasa").evaluate(root => {
    const earth = root.querySelector("[data-earth]");
    const photo = root.querySelector("[data-lavasa-photo]");
    const canvas = earth.querySelector("canvas");
    const opacity = el => {
      let result = 1;
      for (; el && el !== root; el = el.parentElement) {
        const css = getComputedStyle(el);
        if (css.visibility === "hidden") return 0;
        result *= Number(css.opacity);
      }
      return result;
    };
    return {
      mode: root.dataset.journeyMode,
      phase: root.dataset.journeyScene,
      progress: Number(root.dataset.journeyProgress),
      ready: root.dataset.globeStatus,
      inert: earth.inert || Boolean(earth.closest("[inert]")),
      earthOpacity: opacity(earth),
      controlsOpacity: opacity(earth.querySelector("button").parentElement.parentElement),
      photoOpacity: opacity(photo),
      imageOpacity: opacity(photo.querySelector("img")),
      maskStroke: 2 * (Number(photo.querySelector("[data-lavasa-mask]").getAttribute("values").trim().split(/\s+/).at(-1)) - 64.5),
      filtered: getComputedStyle(photo.querySelector("[data-lavasa-image]")).maskImage !== "none",
      letteringOpacity: opacity(photo.querySelector("svg")),
      welcomeOpacity: opacity(photo.querySelector("svg").nextElementSibling),
      canvas: canvas ? [canvas.width, canvas.height] : null,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  const samples = [];
  const layouts = [];
  for (const [width, height] of [[1440, 900], [1280, 720], [1024, 700], [768, 1024], [390, 844], [320, 568], [1280, 650], [844, 390], [568, 320]]) {
    await page.setViewportSize({ width, height });
    await open();
    const g = await geometry();
    assert(Math.abs(g.range - height * 1.2) < 3, `${width}: section must be 220svh`);
    await seek(g.top);
    await page.waitForFunction(() => document.querySelector("#lavasa").dataset.globeStatus === "ready");
    const initial = await state();
    assert(initial.mode === "cinematic", `${width}x${height}: lettering animation must run at every viewport size`);
    const canvas = initial.canvas;
    const intro = await page.locator("#lavasa").evaluate(root => {
      const rect = el => { const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right }; };
      return { copy: rect(root.querySelector("h2").parentElement), earth: rect(root.querySelector("[data-earth]")) };
    });
    for (const [name, bounds] of Object.entries(intro)) {
      assert(bounds.top >= 64 && bounds.bottom <= height + 1, `${width}x${height}: ${name} must fit below the header and above the viewport bottom`);
      assert(bounds.left >= -1 && bounds.right <= width + 1, `${width}x${height}: ${name} must fit horizontally`);
    }
    const alignment = await page.locator("#lavasa").evaluate(root => {
      const a = root.querySelector("h2").getBoundingClientRect();
      const b = root.querySelector("[data-lavasa-photo]").getBoundingClientRect();
      return Math.max(Math.abs(a.left - b.left), Math.abs(a.top - b.top), Math.abs(a.width - b.width));
    });
    assert(alignment < 2, `${width}: welcome lettering must align with its heading`);
    const positions = width === 1024 ? [0, .25, .3, .4, .5, .55, .6, .65, .75, 1] : [0, .5, .75, 1];
    for (const direction of [positions, [...positions].reverse()]) {
      for (const progress of direction) {
        await seek(g.top + g.range * progress);
        const s = await state();
        assert(Math.abs(s.progress - progress) < .025, `${width}: progress ${progress}: ${s.progress}`);
        assert(s.phase === (progress <= .25 ? "intro" : progress < .65 ? "transition" : "place"), `${width}: wrong phase at ${progress}`);
        assert(s.inert === (progress > .25), `${width}: control availability at ${progress}`);
        if (progress <= .25) assert(s.controlsOpacity > .99, `${width}: controls must remain visible after reverse scroll`);
        assert(s.overflow <= 1, `${width}: horizontal overflow`);
        assert(JSON.stringify(s.canvas) === JSON.stringify(canvas), `${width}: canvas resized during transition`);
        if (progress === 0) assert(s.earthOpacity > .99 && s.maskStroke === 0 && s.welcomeOpacity < .01, `${width}: intro must start inside welcome lettering`);
        if (progress > .25 && progress < .65) assert(s.maskStroke > 0 && s.maskStroke < 600, `${width}: the photograph must expand through the letters`);
        if (progress >= .75) assert(s.earthOpacity < .01 && s.maskStroke >= 600 && s.welcomeOpacity > .99, `${width}: photo and welcome must settle`);
        if (progress >= .6) assert(!s.filtered, `${width}: completed letter mask must stop filtering`);
        if (progress > .25 && progress <= .55) assert(s.filtered, `${width}: reverse scroll must restore the letter mask`);
        if (width === 1440 && [0, .5].includes(progress)) await page.screenshot({ path: `output/playwright/lavasa-welcome-${progress}.png` });
        samples.push({ width, target: progress, ...s });
      }
    }
    await page.locator("[data-globe-interactive] [tabindex='0']").focus();
    await seek(g.top + g.range * .75);
    assert(await page.locator("[data-editions-link]").evaluate(el => el === document.activeElement), "Hidden controls must transfer focus to Editions");
    const photo = await page.locator("[data-lavasa-photo]").boundingBox();
    assert(photo.y >= 64 && photo.y + photo.height <= height + 1, `${width}x${height}: photograph and caption must fit in the viewport`);
    assert(photo.x >= -1 && photo.x + photo.width <= width + 1, `${width}x${height}: photograph must fit horizontally`);
    const frame = await page.locator("[data-lavasa-photo] svg").boundingBox();
    assert(Math.abs(frame.width / frame.height - 16 / 9) < .01, `${width}x${height}: landscape must keep its aspect ratio`);
    layouts.push({ width, height, intro, photo, overflow: (await state()).overflow });
    await page.screenshot({ path: `output/playwright/lavasa-after-${width}-${height}-place.png` });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await open();
  let g = await geometry();
  await seek(g.top);
  const globe = page.locator("[data-globe-interactive] [tabindex='0']");
  await globe.focus();
  await globe.press("ArrowRight");
  await globe.press("ArrowLeft");
  await globe.press("Home");
  await page.keyboard.press("Tab");
  assert(await page.getByRole("button", { name: "Shake the globe to reveal the Easter egg" }).evaluate(el => el === document.activeElement), "Keyboard Tab must reach globe controls");
  await page.getByRole("button", { name: "Pause globe momentum", exact: true }).click();
  assert(await page.getByRole("button", { name: "Enable globe momentum", exact: true }).getAttribute("aria-pressed") === "true", "Pause state missing");
  await page.getByRole("button", { name: "Enable globe momentum", exact: true }).click();
  await page.getByRole("button", { name: "Reset globe rotation", exact: true }).click();
  const box = await globe.boundingBox();
  assert(box.height <= 900 * .62 + 2, "Globe exceeds 62svh");
  await page.mouse.move(box.x + box.width * .4, box.y + box.height * .5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .7, box.y + box.height * .5, { steps: 12 });
  await page.mouse.up();
  assert(await page.locator("[data-globe-egg]").count() === 0, "Ordinary drag must not trigger shake");
  await globe.focus();
  await globe.press("Space");
  await page.locator("[data-globe-egg]").waitFor();
  await page.screenshot({ path: "output/playwright/lavasa-after-1440-globe.png" });
  await page.waitForTimeout(4200);
  await page.mouse.move(box.x + box.width * .5, box.y + box.height * .5);
  await page.mouse.down();
  for (const offset of [100, -100, 100, -100, 100]) await page.mouse.move(box.x + box.width * .5 + offset, box.y + box.height * .5);
  await page.mouse.up();
  await page.locator("[data-globe-egg]").waitFor();
  await seek(g.top + g.range * .75);
  const canLoseContext = await page.locator("[data-earth] canvas").evaluate(canvas => {
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    window.__journeyContextExtension = gl.getExtension("WEBGL_lose_context");
    window.__journeyContextExtension?.loseContext();
    return Boolean(window.__journeyContextExtension);
  });
  assert(canLoseContext, "WEBGL_lose_context unavailable");
  await page.waitForFunction(() => document.querySelector("#lavasa").dataset.globeStatus === "fallback");
  await page.waitForTimeout(150);
  await page.evaluate(() => window.__journeyContextExtension.restoreContext());
  await page.waitForFunction(() => document.querySelector("#lavasa").dataset.globeStatus === "ready");
  assert((await state()).inert && (await state()).earthOpacity < .01, "Context recovery must not reactivate hidden globe");
  await seek(g.top);
  assert(!(await state()).inert, "Recovered globe must work when intro returns");
  await page.locator("[data-earth] canvas").evaluate(canvas => {
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    const draw = gl.drawElements;
    window.__journeyDraws = 0;
    gl.drawElements = function (...args) { window.__journeyDraws++; return draw.apply(this, args); };
  });
  await globe.focus();
  await globe.press("ArrowRight");
  await page.waitForTimeout(300);
  assert(await page.evaluate(() => window.__journeyDraws > 0), "Keyboard input must wake the recovered globe");
  await page.waitForTimeout(2000);
  const idleDraws = await page.evaluate(() => window.__journeyDraws);
  await page.waitForTimeout(400);
  assert(await page.evaluate(count => window.__journeyDraws === count, idleDraws), "Idle globe must stop rendering");
  await globe.press("ArrowLeft");
  await page.waitForTimeout(100);
  assert(await page.evaluate(count => window.__journeyDraws > count, idleDraws), "Keyboard input must restart idle rendering");
  await seek(g.top + g.range + 1800);
  const offscreenDraws = await page.evaluate(() => window.__journeyDraws);
  await page.waitForTimeout(300);
  assert(await page.evaluate(count => window.__journeyDraws === count, offscreenDraws), "Offscreen globe must suspend rendering");
  const resizeSamples = [];
  await page.setViewportSize({ width: 1440, height: 900 });
  g = await geometry();
  await seek(g.top + g.range * .5);
  for (const [width, height] of [[1024, 700], [1023, 700], [1024, 699], [390, 844], [844, 390], [320, 568], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(750);
    const s = await state();
    assert(s.mode === "cinematic", `${width}x${height}: resizing must retain the lettering animation`);
    assert(s.overflow <= 1, `${width}x${height}: resizing during reveal must not overflow`);
    const position = await geometry();
    const expected = await page.evaluate(({ top, range }) => Math.max(0, Math.min(1, (scrollY - top) / range)), position);
    assert(Math.abs(s.progress - expected) < .025, `${width}x${height}: refreshed scene progress must match scroll`);
    const bounds = await page.locator("[data-lavasa-photo]").boundingBox();
    assert(bounds.x >= -1 && bounds.x + bounds.width <= width + 1, `${width}x${height}: photograph must remain contained during resize`);
    assert(s.inert === (s.progress > .25), `${width}x${height}: refreshed controls must match visible scene`);
    await seek(position.top);
    assert((await state()).filtered, `${width}x${height}: reverse after resize must restore the lettering mask`);
    await seek(position.top + position.range * expected);
    resizeSamples.push({ width, height, progress: s.progress, overflow: s.overflow });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await open();
    g = await geometry();
    await seek(g.top - 70);
    await page.waitForFunction(() => document.querySelector("#lavasa").dataset.globeStatus === "ready");
    const s = await state();
    assert(s.mode !== "cinematic" && !s.inert && s.imageOpacity > .99 && s.welcomeOpacity > .99, `${width}: reduced motion must retain all content and controls`);
    assert(s.overflow <= 1, `${width}: reduced motion must not overflow`);
    if (width === 1440) assert(g.range < height, "Reduced motion must remove cinematic section spacing");
    await page.screenshot({ path: `output/playwright/lavasa-after-reduced-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/media/journey/lavasa-welcome-distance.png", route => route.fulfill({ status: 503, body: "unavailable" }));
  await open();
  await page.waitForFunction(() => document.querySelector("#lavasa svg").dataset.maskFailed === "true");
  assert(!(await state()).filtered, "Failed distance texture must keep the photograph visible");
  await page.unroute("**/media/journey/lavasa-welcome-distance.png");
  await page.route("**/media/journey/world.geojson", route => route.fulfill({ status: 503, body: "unavailable" }));
  await open();
  g = await geometry();
  await seek(g.top);
  await page.waitForFunction(() => document.querySelector("#lavasa").dataset.globeStatus === "fallback");
  assert((await state()).inert, "Failed geography must disable globe controls");
  await seek(g.top + g.range * .75);
  assert((await state()).imageOpacity > .99 && (await state()).welcomeOpacity > .99, "Geography failure must retain landscape and Editions");
  await page.locator("[data-editions-link]").click();
  await page.waitForFunction(() => location.hash === "#editions");
  await page.waitForTimeout(1600);
  assert(await page.locator("#editions").evaluate(el => Math.abs(el.getBoundingClientRect().top) < 110), "Editions link must reach its section");
  const editionPhoto = page.locator("#editions [data-photo-reveal]").first();
  const editionTop = await editionPhoto.evaluate(el => el.getBoundingClientRect().top + scrollY);
  await seek(editionTop - 900 * .98);
  const closed = await editionPhoto.evaluate(el => getComputedStyle(el).clipPath);
  await seek(editionTop - 900 * .2);
  const opened = await editionPhoto.evaluate(el => getComputedStyle(el).clipPath);
  assert(closed !== opened && opened !== "none", "Editions must retain its independent image reveal");
  await page.unroute("**/media/journey/world.geojson");
  assert(errors.length === 0, `Page errors: ${errors.join("; ")}`);
  return { sceneSamples: samples.length, resizeSamples, layouts: layouts.map(({ width, height, overflow }) => ({ width, height, overflow })), interactions: "keyboard, drag, shake, reset, pause, focus transfer, resize, reduced motion, geography failure, WebGL recovery, idle and offscreen suspension, responsive reveal, resize state, Editions link and image reveal", errors };
}
