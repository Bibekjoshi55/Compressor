const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const selectLabel = document.getElementById('selectLabel');
const para = document.getElementById('para');
const uploadBtn = document.getElementById('uploadBtn');
const compressBtn = document.getElementById('compressBtn');
const compress = document.getElementById('after_compress');
const before = document.getElementById('before');
fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            selectLabel.classList.add('hidden');
            para.classList.add('hidden');
            uploadBtn.classList.remove('hidden');
            compressBtn.classList.remove('hidden');
            compress.classList.remove('hidden')
            before.classList.add('hidden')


        };

        // ✅ Trigger file reading
        reader.readAsDataURL(file);
    }
});
