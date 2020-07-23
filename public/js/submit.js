//restrict the upload file size
const uploadField = document.getElementById("uploaded_files");

uploadField.onchange = function () {
  for (let i = 0; i < this.files.length; i++) {
    if (this.files[i].size > 2097152) {
      alert("Over 2MB size is not allowed");
      this.value = "";
    }
  }
};
