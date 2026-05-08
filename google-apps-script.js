const SHEET_ID = "13u8kmSV-jibqqzpwdDEdWClG1UxpNkfn1ok7j-1FSho";
const SHEET_NAME = "Bookings";

function doPost(e) {
  try {
    // Check request exists
    if (!e || !e.postData) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "No POST data received",
        }),
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const body = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet if missing
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);

      sheet.appendRow([
        "Timestamp",
        "Name",
        "Phone",
        "Email",
        "Date",
        "Time",
        "Guests",
        "Occasion",
        "Notes",
      ]);

      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.name || "",
      body.phone || "",
      body.email || "",
      body.date || "",
      body.time || "",
      body.guests || "",
      body.occasion || "",
      body.notes || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: err.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "ok",
      sheet: SHEET_NAME,
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}
