export const cssStyles = `
/* ----------------------
      EMAIL RESET
------------------------ */

body {
	font-family: system-ui, sans-serif;
	font-size: 1rem;
	text-rendering: geometricprecision;
	-webkit-font-smoothing: antialiased;
	overflow: auto hidden;
}

body * {
	line-height: 1.5;
}

code {
	line-height: 1;
}

[style*='position:absolute'],
[style*='position: absolute'] {
	position: relative !important;
}

img[height$='%'] {
	block-size: unset !important;
}

blockquote,
dl,
ol,
p,
pre,
td,
th,
ul {
	margin-block: 0;
}

p {
	margin-block: 1em;
}

table {
	margin-block-end: 0;
	table-layout: auto;
}

blockquote {
	padding-block: 0;
	padding-inline: 16px 0;
	margin: 0;
	border-inline-start: 4px solid #e5e5e5;
}

blockquote::after,
blockquote::before {
	content: none;
}

img {
	max-inline-size: none;
}

pre,
code {
	white-space: pre-wrap;
	background-color: transparent;
}

ul,
ol {
	padding-inline-start: 2.5em;
}

/* ---------------------------------
      CUSTOM STYLES AND HELPERS
----------------------------------- */
a {
	color: var(--interaction-norm, #00bc7d);
	text-decoration: underline;
	cursor: pointer;
}

a:hover,
a:focus {
	color: var(--interaction-norm-hover, #008236);
	text-decoration: none;
}

a:active {
	color: var(--interaction-norm-active, #0d542b);
	text-decoration: none;
}

a:not([href]) {
	text-decoration: none !important;
	color: inherit !important;
	cursor: default !important;
	pointer-events: none;
}

#replyas-root {
	box-sizing: content-box;
	max-inline-size: none;
	overflow: auto;
}

.replyas-hidden {
	display: none;
}

.replyas-sr-only {
	border: 0;
	clip: rect(0 0 0 0);
	block-size: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	inline-size: 1px;
	inset-block-start: 0;
}

.icon-size-3\\.5 {
	inline-size: 14px;
	block-size: 14px;
}

.replyas-embedded:not([width], [style*='width']) {
	max-inline-size: 100%;
	min-inline-size: 38px;
}

.replyas-embedded:not([width], [style*='width'])[src] {
	min-inline-size: 0;
}

blockquote.replyas-blockquote {
	padding-block: 0.2em;
	padding-inline: 1.2em 0;
	border-color: #00bc7d;
	border-inline-start-width: 3px;
	border-inline-start-style: solid;
}

blockquote.replyas_quote blockquote.replyas_quote blockquote.replyas_quote blockquote.replyas_quote blockquote.replyas_quote blockquote.replyas_quote {
	padding-inline: 0;
	border-inline-start-width: 0;
}


/* ---------------------------------
      BUTTONS
----------------------------------- */

.replyas-toggle-button {
	display: inline-flex;
	padding-block: 4px;
	padding-inline: 8px;
	margin: 1em;
	margin-inline-start: 0;
	box-shadow: inset 0 0 0 1px silver;
	border: none;
	border-radius: 8px;
	outline: none;
	background-color: transparent;
	text-align: center;
	transform: translateZ(0);
	transition: 0.15s cubic-bezier(0.22, 1, 0.36, 1), background-position 0s;
	cursor: pointer;
}

.replyas-toggle-button:hover,
.replyas-toggle-button:focus,
.replyas-toggle-button:focus-within,
.replyas-toggle-button.is-hover,
.replyas-toggle-button:active,
.replyas-toggle-button.is-active,
.replyas-toggle-button[aria-expanded='true']:not([aria-controls]) {
	text-decoration: none;
	box-shadow: inset 0 0 0 2px silver;
	background-color: transparent;
}

@supports selector(:focus-visible) {
	.replyas-toggle-button {
		outline: unset;
	}
}

/* ---------------------------------
      IMAGE PLACEHOLDER
----------------------------------- */

.replyas-image-placeholder {
	background-color: rgba(0, 0, 0, 0.067);
	box-sizing: border-box;
	display: inline-flex;
	border-radius: 4px;
	justify-content: center;
	align-items: center;
	color: #5c5958;
	margin-block-end: 7px;
	margin-inline-end: 7px;
}

.replyas-image-placeholder .icon-size-4 {
	inline-size: 1rem;
	block-size: 1rem;
	display: inline-block;
	vertical-align: middle;
	fill: currentcolor;
}

@keyframes anime-loader-rotation {
	from { transform: rotate(0); }
	to { transform: rotate(360deg); }
}

.replyas-circle-loader {
	font-size: 20px;
	display: inline-block;
	inline-size: 1em;
	block-size: 1em;
	transform-origin: 50%;
	vertical-align: middle;
	animation: anime-loader-rotation 2s linear infinite;
}

.replyas-circle-loader-track {
	stroke: currentcolor;
	opacity: 0.2;
}

.replyas-circle-loader-track,
.replyas-circle-loader-circle {
	fill: none;
	stroke-width: 20;
	stroke-linecap: round;
}

@keyframes anime-loader-stroke {
	0% { stroke-dashoffset: 440; }
	50% { stroke-dashoffset: 0; }
	50.1% { stroke-dashoffset: 880; }
}

.replyas-circle-loader-circle {
	stroke: currentcolor;
	stroke-dasharray: 440;
	stroke-dashoffset: 440;
	animation: anime-loader-stroke 4s linear infinite;
}
`;
