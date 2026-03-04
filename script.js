const CLOUD_NAME = "dzyzwjovo";
const UPLOAD_PRESET = "notes_upload";

const BIN_ID = "69a8748343b1c97be9b3704e";
const API_KEY = "$2a$10$Wcs1VtVE8Fv19UlnOewSLegskxgcR0.Mv7.yFzxltzmTVUqbxwC9";

let form = document.getElementById("uploadForm");

if (form) {

    form.addEventListener("submit", async function(e) {

        e.preventDefault();

        let title = document.getElementById("title").value;
        let file = document.getElementById("file").files[0];

        if (!file) {
            alert("Please select a file");
            return;
        }

        let formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {

            let upload = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
                method: "POST",
                body: formData
            });

            let uploadData = await upload.json();
            let url = uploadData.secure_url;

            let res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: {
                    "X-Master-Key": API_KEY
                }
            });

            let data = await res.json();
            let notes = data.record.notes || [];

            notes.push({
                title: title,
                url: url
            });

            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY
                },
                body: JSON.stringify({ notes: notes })
            });

            alert("Upload successful");

            // reload notes
            location.href = "notes.html";

        } catch (error) {

            console.error(error);
            alert("Upload failed");

        }

    });

}

let notesList = document.getElementById("notesList");

if (notesList) {
    loadNotes();
}

async function loadNotes() {

    try {

        let res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: {
                "X-Master-Key": API_KEY
            }
        });

        let data = await res.json();
        let notes = data.record.notes || [];

        notesList.innerHTML = "";

        notes.forEach(note => {

            let li = document.createElement("li");

            li.innerHTML = `
<h3>${note.title}</h3>
<a href="${note.url}" target="_blank">Download</a>
`;

            notesList.appendChild(li);

        });

    } catch (error) {

        console.error("Load notes error:", error);

    }

}