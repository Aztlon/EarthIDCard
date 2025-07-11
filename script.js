document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('idCardCanvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = 'EKID.png';

    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        updateIDCard(); 
    };

    image.onerror = function() {
        console.error("Failed to load background image");
    };

    const uploadImageInput = document.getElementById('uploadImage');
    const imageEditorModal = document.getElementById('imageEditorModal');
    let croppieInstance = null;

    uploadImageInput.addEventListener('change', function(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                if (!croppieInstance) {
                    croppieInstance = new Croppie(document.getElementById('croppieContainer'), {
                        viewport: { width: 200, height: 200, type: 'circle' },
                        boundary: { width: 300, height: 300 },
                        enableOrientation: true,
                        showZoomer: true,
                        enableExif: true
                    });
                }
                croppieInstance.bind({ url: e.target.result });
                imageEditorModal.style.display = 'flex';
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    document.getElementById('cropImageBtn').addEventListener('click', function() {
        croppieInstance.result({ type: 'canvas', size: 'viewport' }).then(function(croppedImage) {
            userImage = new Image();
            userImage.src = croppedImage;
            userImage.onload = updateIDCard;
            imageEditorModal.style.display = 'none';
        });
    });

    document.getElementById('copyBtn').addEventListener('click', function() {
        updateIDCard();
        canvas.toBlob(function(blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(
                function() { console.log('Image copied to clipboard'); },
                function(err) { console.error('Error copying image: ', err); }
            );
        });
    });
    

    document.getElementById('idCardForm').addEventListener('input', updateIDCard);

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        let words = text.split(' ');
        let line = '';
        let lines = [];

        words.forEach((word) => {
            let testLine = line + word + ' ';
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > maxWidth && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        });

        lines.push(line.trim());  
        return lines;
    }

    function updateIDCard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        ctx.font = "14px 'Minecraftia'";
        ctx.fillStyle = "white";

        const name = document.getElementById('name').value;
        const cardId = document.getElementById('cardId').value;
        const house = document.getElementById('house').value;
        const birthYear = document.getElementById('birthYear').value;
        const gender = document.getElementById('gender').value;
        const element = document.getElementById('element').value;
        const affinities = document.getElementById('affinities').value;
        const province = document.querySelector('.custom-select .selected').textContent;
        const profession = document.getElementById('profession').value;
        const username = document.getElementById('username').value;
        const discord = document.getElementById('discord').value;
        const ageGroup = document.getElementById('ageGroup').value;

        const lineHeight = 18;

        ctx.fillText(birthYear, 175, 345);
        ctx.fillText(gender, 135, 375);
        ctx.fillText(element, 135, 410);
        ctx.fillText(affinities, 150, 445);
        ctx.fillText(province, 145, 475);
        ctx.fillText(profession, 160, 510);

        ctx.fillText(username, 90, 585);
        ctx.fillText(discord, 135, 620);
        ctx.fillText(ageGroup, 155, 650);

        // Draw name in a center-aligned textbox at (200, 140) with 20px font
        ctx.save();
        ctx.font = "20px 'Minecraftia'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name, 200, 140);
        ctx.font = "16px 'Minecraftia'";
        ctx.fillText(cardId, 280, 225);
        ctx.fillText(house, 280, 285);
        ctx.restore();

        if (userImage) {
            ctx.drawImage(userImage, 63, 158, 135, 135);
        }
    }

    document.getElementById('downloadBtn').addEventListener('click', function() {
        updateIDCard();
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'EK_ID.png';
        link.click();
    });

    // Toggle dropdown
    document.getElementById('provinceDropdown').addEventListener('click', function(event) {
        this.classList.toggle('active');
        event.stopPropagation(); // Prevent event bubbling
    });

    // Prevent dropdown from closing when clicking on the search box
    document.querySelector('.custom-select .search-box').addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Hide dropdown if clicked outside
    document.addEventListener('click', function(event) {
        document.getElementById('provinceDropdown').classList.remove('active');
    });

    // Select option from dropdown
    document.querySelectorAll('.custom-select .options .option').forEach(option => {
        option.addEventListener('click', function() {
            selectOption(this);
            updateIDCard();
        });
    });

    function selectOption(optionElement) {
        const selected = document.querySelector('.custom-select .selected');
        selected.textContent = optionElement.textContent;
        selected.dataset.value = optionElement.textContent; // Optional: store the value
        document.getElementById('provinceDropdown').classList.remove('active');
    }

    // Filter options based on search
    function filterOptions(input) {
        const filter = input.value.toLowerCase();
        const options = document.querySelectorAll('.custom-select .options .option');
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(filter) ? 'block' : 'none';
        });
    }

    // Add event listener for the search box input
    document.querySelector('.custom-select .search-box').addEventListener('input', function() {
        filterOptions(this);
    });
});