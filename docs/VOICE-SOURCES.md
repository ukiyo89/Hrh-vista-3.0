# Past voice source research

Researched 24 October 2026. This records textual attribution and source provenance. It does not identify people from facial appearance, and does not establish a portrait ID merely because the biography and image lists have the same length.

The supplied `Content pics/Past speak pics/Website Content(Speaker feed back.txt` contains thirteen third-person biographies, not first-person feedback quotations. Keep its copy distinguishable from speaker testimonials.

## Content-owner-confirmed portrait mapping

On 24 October 2026, the content owner explicitly confirmed in chat that numbered photos 01–13 follow the exact order of the thirteen names in the supplied biography file. `speakerProfiles` now assigns portrait IDs 01 through 13 in that order and records this human confirmation in every `portraitSource`. This establishes the implementation mapping by content-owner confirmation; it is not facial comparison or independent LinkedIn portrait verification. The textual LinkedIn associations and role discrepancies documented below remain unchanged by the photo-order confirmation.

## Profile sources

The table records the earlier web-research findings. Statements that research did not establish supplied portrait IDs describe that research only; the subsequent content-owner confirmation above supplies the current mapping.

| Supplied name | LinkedIn source | Evidence and limitation |
| --- | --- | --- |
| Dr Amit Sawhney | https://es.linkedin.com/in/amitsawhney | Profile about text identifies MD of Nippon Group; title also associates CHRIST University Pune Lavasa. Textual profile association is strong; no supplied portrait ID established. |
| Mr Shyambahadur Prajapati | https://in.linkedin.com/in/shyamprajapati | Profile explicitly names GM Infotech. Existing local `public/media/people/sources.json` associates a named portrait with this profile. No supplied portrait ID established by this research. |
| Dr Balasubramanian Sethuraman | https://in.linkedin.com/in/bala-s | Profile names Parekh Integrated Services and honorary degree in HR and organisational development. Official event site explicitly labels named portrait asset. |
| Mr Narasimha Murthy Aradhyula | https://www.linkedin.com/posts/narasimha-murthy-aradhyula_johndeere-deere-johndeerefinancial-activity-7308678063230259202-Ohg2 | Self-authored post identifies John Deere award. Profile slug inferred from post author route; direct profile fetch unavailable. This is a candidate textual association, not definitive event attribution. |
| Mr Rajendra Lingwal | https://in.linkedin.com/in/rajendra-lingwal-7bb2161 | Profile identifies Persistent Systems and shared posts explicitly name SVP HR. Official event site explicitly labels named portrait asset. |
| Ms Gauri Das | https://in.linkedin.com/in/gauridas | Profile names India Factoring and Finance Solutions and HR/CSR. No supplied portrait ID established. |
| Dr Saumya Badgayan Dutta | https://in.linkedin.com/in/dr-saumya-badgayan-dutta-70b4b114 | Exact name profile. Official event page identifies VP HR Business Strategy at Gold Star Jewellery and explicitly labels portrait. Current profile surfaced Lovely Professional University among experience, so historical event role should not automatically be treated as current employment. |
| Mr George Kutty | https://in.linkedin.com/in/george-kutty-578bb234 | Candidate profile: Mumbai HR leader, Malabar Group, formerly Jio. Supplied biography is generic and lacks employer, so exact event-person association remains unconfirmed. |
| Mr Senthil Kumar S | https://in.linkedin.com/in/senthil-kumar-s-90754110 | Candidate profile names HDFC Life and HR/talent acquisition. Official event page explicitly names Senthil Kumar S, AVP Human Resources, HDFC Life. This conflicts with supplied supply-chain biography; needs clarification. |
| Dr. Himanshu Talwar | https://in.linkedin.com/in/drhimanshutalwar | Profile identifies public speaking and links his own website. Other same-name profiles concern unrelated professions. No supplied portrait ID established. |
| Mr.Debansh Roy | https://in.linkedin.com/in/debanshroy | Profile currently names Addepar. Supplied AllianceBernstein role is historical according to current employer's welcome post. No supplied portrait ID established. |
| Dr. Ganesh Natarajan | https://in.linkedin.com/in/ganeshnatarajan | Exact-name profile and 5F World association. No supplied portrait ID established. |
| Mr.Sumit Atri | https://in.linkedin.com/in/sumit-atri-a7b661b | Profile identifies Reliance Jio and HR expertise. No supplied portrait ID established. |

## Official event image provenance

The live official page https://www.hrvista.live/ explicitly associates image tags with Balasubramanian Sethuraman, Rajendra Lingwal, Dr. Saumya Badgayan Dutta, and Senthil Kumar S. Full image URLs extracted from the local official-page snapshot are preserved in `output/sources/voices/named-image-sources.json`. LinkedIn image URLs contain expiry parameters and may be unavailable later.

These named image associations can support exact file or decoded-pixel comparison. Facial resemblance, matching list order, clothing, or approximate visual similarity are not identity evidence. A SHA256 comparison of the thirteen supplied original JPEG files against all JPG, JPEG, PNG and WebP files under `public/` and `output/` found no exact file matches. That does not rule out resized or recompressed copies. This research established no verified supplied portrait ID mapping. The subsequent content-owner confirmation above assigns IDs 01 through 13 by the explicitly confirmed biography order.

### Final source check

The final source check attempted to retrieve all five explicitly named LinkedIn CDN assets in `named-image-sources.json` and compare decoded sRGB RGB pixel SHA256 and dimensions against all thirteen supplied originals. Every CDN request returned HTTP 403, so no remote image was decoded and no same-asset match was established. The structured result is `output/sources/voices/exact-decoded-pixel-results.json`. No resizing, perceptual similarity, or face comparison was used.

Direct LinkedIn profile opens for Balasubramanian, Senthil and Debansh returned HTTP 999. A fresh web search again surfaced their exact profiles and the same textual associations: Parekh Integrated Services, HDFC Life HR/talent acquisition, and Addepar respectively. These search-index results support the profile research but do not independently verify the supplied photos. Applied photo assignments remain based on the user's explicit order confirmation.

## Supporting attribution and discrepancy sources

- Official HR VISTA brochure: https://www.hrvista.live/HRPoster.pdf (Senthil Kumar S, HDFC Life; Balasubramanian S, Parekh).
- Saumya speaker introduction by D Y Patil University: https://www.linkedin.com/posts/vpsm_introducing-dr-saumya-badgayan-a-visionary-activity-7303822409265037313-IpOf (historical Gold Star Jewellery role).
- George Kutty self-authored employer announcement: https://www.linkedin.com/posts/george-kutty-578bb234_new-chapter-new-industry-im-thrilled-activity-7365791363637854209-xXhJ (Group CHRO, Malabar Gold & Diamonds; still requires event-person confirmation).
- Addepar employer welcome surfaced in an employee's shared post: https://in.linkedin.com/in/vishyb (Addepar announcement names Debansh Roy as Regional Director, People Partner APAC).

Do not silently rewrite the supplied biographies from these sources. Ask the content owner to resolve role/date conflicts and approve corrections. No source above verifies every promotional statement or credential in the supplied text.
