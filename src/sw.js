const id = "chopchop";

/**
 * @type {chrome.scripting.RegisteredContentScript[]}
 */
const chopChopContentScripts = [
	{
		id,
		allFrames: true,
		css: ["chopchop.css"],
		matches: ["https://*/*", "http://*/*"],
		excludeMatches: [
			"*://localhost:*/*",
			"*://*.localhost:*/*",
			"*://*.internal:*/*",
			"*://*.test:*/*",
			"*://*.测试:*/*",
			"*://*.परीक्षा:*/*",
			"*://*.испытание:*/*",
			"*://*.테스트:*/*",
			"*://*.טעסט:*/*",
			"*://*.測試:*/*",
			"*://*.آزمایشی:*/*",
			"*://*.பரிட்சை:*/*",
			"*://*.δοκιμή:*/*",
			"*://*.إختبار:*/*",
			"*://*.テスト:*/*",
		],
		world: "MAIN",
	},
];

let isRegistered = false;

/**
 * @param {boolean} isRegistered
 */
function updateActionText(isRegistered) {
	if (isRegistered) {
		chrome.action.setTitle({ title: "Click to disable ChopChop." });
		chrome.action.setBadgeText({ text: "⏽" });
		chrome.action.setBadgeTextColor({ color: [255, 255, 255, 255] });
		chrome.action.setBadgeBackgroundColor({ color: [76, 189, 116, 255] });
	} else {
		chrome.action.setTitle({ title: "Click to enable ChopChop." });
		chrome.action.setBadgeText({ text: "⭘" });
		chrome.action.setBadgeTextColor({ color: [0, 0, 0, 255] });
		chrome.action.setBadgeBackgroundColor({ color: [255, 255, 255, 255] });
	}
}

/**
 * @type {chrome.scripting.ContentScriptFilter}
 */
const chopChopContentScriptFilter = { ids: [id] };

chrome.scripting
	.getRegisteredContentScripts(chopChopContentScriptFilter)
	.then((scripts) => {
		isRegistered = scripts.length > 0;
		updateActionText(isRegistered);
	}, console.error);

async function toggleChopChopInjection() {
	try {
		if (isRegistered) {
			console.log("Deregistering ChopChop");
			await chrome.scripting.unregisterContentScripts(
				chopChopContentScriptFilter
			);
		} else {
			console.log("Registering ChopChop");
			await chrome.scripting.registerContentScripts(chopChopContentScripts);
		}
		isRegistered = !isRegistered;
		console.log({ isRegistered });
		updateActionText(isRegistered);
	} catch (e) {
		console.error(e);
	}
}

chrome.action.onClicked.addListener(toggleChopChopInjection);
chrome.runtime.onInstalled.addListener(toggleChopChopInjection);
