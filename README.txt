BALWYN GARAGE DOORS — PREMIUM WEBSITE, VERSION 3
============================================================

OPEN
Extract the ZIP and open index.html in a modern browser.
Keep the assets folder beside it. No build, installation or
external font/CDN connection is needed.

FILES
index.html                  Complete one-page HTML website
assets/site.css             Responsive design and typography
assets/app.js               Navigation, modals and enquiry form
assets/style-picker.js      Interactive door-style preview
assets/motion.js            Entrance and scroll animation
assets/site-config.js       Business contact configuration
assets/favicon.svg          Editable original brand mark
assets/images/              Eight generated branded photos,
                            plus responsive 800px versions
assets/fonts/               Open Sans fonts and licence notices
IMAGE-BRIEFS.json           Original image prompts and dimensions

DESIGN AND FEATURES
Deep navy/green, warm off-white and copper. Modern sans-serif
headings, generous spacing, large photography and rounded panels.

- Cinematic hero with staggered text and gentle photo movement.
- Three direct service choices below the hero.
- Repairs, installation and automation service sections.
- Interactive charcoal, timber-look and classic door previews.
- Full-size image modal and enquiry for the selected style.
- About, process, service areas and native FAQ sections.
- Enquiry builder with photo selection and contact consent.
- Responsive mobile navigation and fixed quote action.
- Scroll reveal, image crossfade, hover effects, shrinking
  sticky header and page-progress indicator.
- Reduced-motion preferences are respected. Content remains
  visible if JavaScript is unavailable.

BUSINESS DETAILS TO CONFIRM
Balwyn Garage Doors is a provisional concept brand. The real
business name, phone, email, services and coverage were not
supplied. Confirm them with the client before public launch.
No fabricated reviews, ratings, qualifications, trading history,
prices or availability guarantees have been added.

Edit assets/site-config.js:
  businessName: approved business name
  phone: real business phone number
  email: real business enquiry email
  formEndpoint: optional HTTPS form receiver
  address: approved location/address

Changing businessName updates the header/footer brand text and
page title. Review remaining body copy, metadata and the SVG
mark when rebranding. Names physically included in the generated
photos will require regenerated images for a different brand.
websiteUrl and serviceArea are reserved config entries; they do
not automatically rewrite SEO URLs or service-area copy.

ENQUIRY MODES
1. Current default, no email or receiver: validates the form and
   prepares a summary that can be copied or downloaded as .txt.
   Nothing is sent and the interface states this clearly.
2. Set email: the summary offers an Open email app link. The
   visitor reviews and sends the enquiry in their mail app.
   Selected photos need to be attached manually there.
3. Set formEndpoint: posts multipart/form-data with the details
   and selected photos to that receiver. It must allow the
   website origin (CORS), accept the fields below, and return a
   2xx response only after accepting the enquiry. JSON responses
   with success:false, ok:false or an error are treated as errors.

Fields: name, phone, email, suburb, service, contact_time,
message, consent, business_name, optional door_style and photos.
Up to 3 JPG, PNG or WebP images, maximum 5 MB each.
The website field is a honeypot and must stay blank.

A selected style is included in new-door enquiries. Automatic
style text can update when another style is selected, while
visitor-written text is preserved. Repair/opener selections
clear the previous new-door style context.

The form blocks duplicate in-flight submissions, uses a
20-second timeout and preserves details on failure. A timeout
cannot prove whether a receiver accepted an enquiry; check
receiver logs before resubmitting if duplicate handling matters.
Configure server-side spam protection, rate limiting, delivery
and privacy controls at the receiver. Do not put mail credentials
or private API keys into this static website.

PHOTOGRAPHY
All eight photos are generated concepts for this design, not
photos of the client's real team, customers or completed work.
The style preview is labelled as inspiration. Replace concepts
with approved real photography when available.

Native dimensions:
Hero                       1672 x 941
Repairs                    1448 x 1086
Installation               1448 x 1086
Automation                 1448 x 1086
Team                       1122 x 1402
Charcoal, timber, classic   1536 x 1024 each

WebP files and responsive 800px versions are included.

BEFORE PUBLIC LAUNCH
Approve all business details and service claims. Connect and
test email or a form receiver. Supply an approved privacy policy.
Review title, description and social metadata for the real domain.
Add canonical and absolute og:image URLs after hosting is known.
Remove the preview robots noindex,nofollow tag from index.html.
Upload index.html and the entire assets folder to the web host.

VERIFICATION
Browser-reviewed desktop design and responsive widths at 360,
390 and 768 pixels, with no horizontal page overflow observed.
Checked mobile navigation, style selection and crossfade, full-
size modal, style-to-enquiry selection, FAQ, enquiry summary,
context clearing and copy action. No site-origin console errors
were observed. Local references, image files, bundled fonts,
JavaScript syntax and ZIP integrity were checked.

Live email/remote form delivery has not been tested because
client contact details and the receiver have not been supplied.
