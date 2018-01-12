'use strict';

	/** {String} App Client ID from the Google Dev Console */
const CLIENT_ID = 'YOUR CLIENT ID HERE',
	/** {String} App API Key from the Google Dev Console */
	API_KEY = 'YOUR API KEY HERE',
	/** {Array<String>} URL for the Google Drive v3 API discovery docs */
	DRIVE_API_DISCOVERY = ['https://www.googleapis.com/discovery/v1/apis/drive/v2/rest'],
	/** {String} General Google Drive API scope URL */
	SCOPE = 'https://www.googleapis.com/auth/drive';

var authFields,
	loadForm,
	loadFields,
	docIdInput;

/**
 * Get inputs and set up event listeners.
 */
window.addEventListener('load', function () {
	authFields = document.getElementById('auth-fields');
	loadFields = document.getElementById('load-fields');
	docIdInput = document.getElementById('load-id-input');
	
	document.getElementById('auth-btn').onclick = function () {
		gapi.auth2.getAuthInstance().signIn();
	};
	
	document.getElementById('load-form').onsubmit = function (e) {
		e.preventDefault();
		
		loadDoc(docIdInput.value);
	};
}, false);

/**
 * Load the Google Client and Auth2 libraries once their script is loaded.
 */
function handleClientLoad() {
	gapi.load('client:auth2', initAPI);
}

/**
 * Initialize the Google Client API.
 * @returns {Promise} Resolves when the function is done
 */
async function initAPI() {
	await(gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		discoveryDocs: DRIVE_API_DISCOVERY,
		scope: SCOPE
	}));
	
	// Add an event listener for when the user signs in.
	gapi.auth2.getAuthInstance().isSignedIn.listen(handleAuthResult);
	
	// Call `handleAuthResult` in case the user is already signed in.
	handleAuthResult(gapi.auth2.getAuthInstance().isSignedIn.get());
}

/**
 * Update which inputs are enabled/disabled based on whether the user is signed in.
 * @param {Boolean} isSignedIn - Whether the user is signed in with a Google Drive account
 */
function handleAuthResult(isSignedIn) {
	if (!isSignedIn) {
		loadFields.disabled = true;
		authFields.disabled = false;
		return;
	}
	
	authFields.disabled = true;
	loadFields.disabled = false;
}

/**
 * Load a Google Doc as HTML.
 * @param {String} docId - The ID of the Google Doc to load
 * @param {Promise} Resolves when the function is done
 */
async function loadDoc(docId) {
	try {
		// Try to call the Google Drive API's file export function.
		var exportRes = await(gapi.client.drive.files.export({
			fileId: docId,
			mimeType: 'text/html'
		}));
	} catch (err) {
		alert('Something went wrong.  Are you sure that is a valid ID for a Google Doc in your Google Drive?');
		return;
	}
	
	// For now, just open a window with the exported HTML.
	var outputWin = window.open('', '_blank', 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes');
	outputWin.document.documentElement.innerHTML = exportRes.body;
	
	///////////////////////////////////////////////
	//                                           //
	//   CALL YOUR HTML PARSING FUNCTION HERE!   //
	//        (Pass it `exportRes.body`)         //
	//                                           //
	///////////////////////////////////////////////
}
