const CLOUD_NAME = "dzyzwjovo";
const UPLOAD_PRESET = "notes_upload";

let form = document.getElementById("uploadForm");

if (form) {

    form.addEventListener("submit", async function(e) {

        e.preventDefault();

        let title = document.getElementById("title").value;
        let file = document.getElementById("file").files[0];

        if (!title || !file) {
            alert("Enter title and choose file");
            return;
        }

        try {

            let formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            let response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
                    method: "POST",
                    body: formData
                }
            );

            let data = await response.json();

            if (!data.secure_url) {
                alert("Upload failed");
                console.log(data);
                return;
            }

            let notes = JSON.parse(localStorage.getItem("notes")) || [];

            notes.push({
                title: title,
                url: data.secure_url
            });

            localStorage.setItem("notes", JSON.stringify(notes));

            alert("Upload successful");

            window.location.href = "notes.html";

        } catch (err) {

            console.error(err);
            alert("Upload error");

        }

    });

}

let notesList = document.getElementById("notesList");

if (notesList) {

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.forEach(note => {

        let li = document.createElement("li");

        li.innerHTML = `
<h3>${note.title}</h3>
<a href="${note.url}" target="_blank">Download</a>
`;

        notesList.appendChild(li);

    });

}