function isConstituentRecordPage() {
  const regex = /^https:\/\/host\.nxt\.blackbaud\.com\/constituent\/records\/\d+$/;
  return regex.test(window.location.href);
}
function paragraph(text) {
	return new docx.Paragraph({text: text});
}
function title(text) {
	return new docx.Paragraph({text: text, heading: docx.HeadingLevel.TITLE});
}
//app-constituent-summary-tile -> sky-tile-content-section -> many sky-definition-list-content
function generateSummary() {
	const tile = Array.from(document.querySelectorAll("app-constituent-summary-tile"))[0];
	const data = new Map(Array.from(tile.querySelectorAll("sky-definition-list-content")).map((it) => {return it.innerText.split("\n");}));
	return paragraph(data.get("Position") + " at " + data.get("Name");
}
function generateTitle() {
	const userName = Array.from(document.querySelectorAll("sky-page-summary-title"))[0].innerText.trim();
	return title(userName);
}
function getUserRoles() {
	const roles = Array.from(document.querySelectorAll('[data-sky-id="constituent-codes-tile-code"]'))
		.map((it) => {return it.innerText.trim();});
	return paragraph("Roles: " + roles.join(", ") + ".");
}
function getGivingSummary() {
	const tgv = Array.from(document.querySelectorAll('[data-sky-id="total-giving-value"]'))[0];
	return paragraph("total given: " + tgv.innerText);
}
function getNotes() {
	const noteSection = Array.from(document.querySelectorAll('.notes-tile.sky-tile-parent'))[0];
	const items = Array.from(noteSection.querySelectorAll("sky-repeater-item"));
	const titleBars = items.map((it) => {return it.querySelectorAll("sky-repeater-item-title")[0];});
	const sources = titleBars.map((it) => {return it.querySelectorAll("strong")[0].innerText.trim();});	
	const dates = titleBars.map((it) => {return it.querySelectorAll("span")[0].innerText.trim();});
	const texts = items.map((it) => {return it.querySelectorAll("sky-repeater-item-content")[0].innerText.trim();});
	return new docx.Paragraph({children: 
		sources.map((it, i) => {
			new docx.TextRun(it + ": " + dates[i] + "\n" + texts[i])
		})
	});
}
if (isConstituentRecordPage()) {
	const doc = new docx.Document({
		sections: [{
			properties: {},
			children: [
				generateTitle(),
				generateSummary(),
				getUserRoles(),
				getGivingSummary(),
				getNotes()
			]
		}]
	});
	docx.Packer.toBlob(doc).then((it) => {
		saveAs(it, "example.docs");
		console.log("saved");
	});
}

