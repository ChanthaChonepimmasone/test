function updateVisitorCount() {
    if (!localStorage.getItem('visitors')) {
        localStorage.setItem('visitors', '0');
    }
    let visitors = parseInt(localStorage.getItem('visitors')) || 0;
    visitors++;
    localStorage.setItem('visitors', visitors.toString());

    const visitorElement = document.getElementById('visitor-count');
    if (visitorElement) {
        visitorElement.textContent = `ຜູ້ເຂົ້າເບິ່ງ: ${visitors}`;
    }
}

const fullKaraokeToLao = {
    "Khuen kup": "ຄືນກັບ",
    "Khuen kub": "ຄືນກັບ",
    "Khuen ni": "ຄືນນີ້",
    "Khuen krn": "ຄືນກ່ອນ",
    "Khuen varn": "ຄືນວານ",
    "Khuen ngern": "ຄືນເງິນ",
    "Khuen mun": "ຄືນມັນ",
    "Khuen ku": "ຄືນກູ",
    "kart ": "ກາດ",
    "O": "ໂອ",
    "Okart": "ໂອກາດ",
    "lw": "ແລ້ວ",
    "song": "ສົງ",
    "khrng": "ຂອງ",
    "khrng khuan": "ຂອງຂວັນ",
    "war": "ວ່າ",
    "khai": "ໄຂ່",
    "za nom": "ຊານົມ",
    "nom": "ນົມ",
    "ແອັດ": "Add",
    "ເເອັດ": "Add",
    "ຕີ້": "ty",
    "u": "ຢູ່",
    "d": "ດີ",
    "t": "ທີ່",
    "ໆ": "2",
    "r": "ອາ",
    "e": "ອີ່",
    "pen": "ເປັນ",
    "z": "ແຊັດ",
    "c": "ຊິ",
    "ຊິ": "C",
    "ເຮັດ": "h",
    "ຫຍັງ": "Y",
    "ຍັງ": "y",
    "ຢູ່": "u",
    "O": "ໂອ",
    "H": "ເຮັດ",
    "h": "ເຮັດ",
    "k": "ເຄ",
    "m": "ໂມງ",
};

function karaokeToLao(text) {
    // ใช้ dropdown ที่ซ่อนอยู่แทนที่จะใช้ element ที่ไม่มีอยู่
    const directionSelect = document.getElementById('direction');
    const direction = directionSelect ? directionSelect.value : 'lao-to-karaoke';
    
    if (direction === 'karaoke-to-lao') {
        // แปลงจาก Karaoke เป็น Lao - ติดกันทั้งหมด (ไม่รักษาช่องว่าง)
        let lowerText = text.toLowerCase();
        let keys = Object.keys(fullKaraokeToLao).sort((a, b) => b.length - a.length);
        let result = '';
        let i = 0;

        while (i < lowerText.length) {
            let matched = false;

            // ข้ามช่องว่างและอักขระพิเศษ
            if (lowerText[i] === ' ' || lowerText[i] === '\t' || lowerText[i] === '\n') {
                i++;
                continue;
            }

            for (let key of keys) {
                if (lowerText.slice(i, i + key.length) === key) {
                    result += fullKaraokeToLao[key];
                    i += key.length;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                result += lowerText[i];
                i++;
            }
        }

        return result;
    } else {
        // แปลงจาก Lao เป็น Karaoke - เพิ่มช่องว่างระหว่างคำ
        let keys = Object.keys(fullKaraokeToLao).sort((a, b) => b.length - a.length);
        let result = '';
        let i = 0;

        while (i < text.length) {
            let matched = false;

            // รักษาช่องว่างจาก input
            if (text[i] === ' ' || text[i] === '\t' || text[i] === '\n') {
                result += text[i];
                i++;
                continue;
            }

            for (let key of keys) {
                if (text.slice(i, i + key.length) === key) {
                    // เพิ่มช่องว่างก่อนคำ (ยกเว้นคำแรก)
                    if (result.length > 0 && result[result.length - 1] !== ' ') {
                        result += ' ';
                    }
                    result += fullKaraokeToLao[key];
                    i += key.length;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                // เพิ่มช่องว่างก่อนอักขระ (ยกเว้นอักขระแรก)
                if (result.length > 0 && result[result.length - 1] !== ' ') {
                    result += ' ';
                }
                result += text[i];
                i++;
            }
        }

        return result;
    }
}

function translateText() {
    const inputText = document.getElementById('inputText').value.trim();
    const outputDiv = document.getElementById('output');
    const loading = document.getElementById('loading');
    const copyBtn = document.getElementById('copyBtn');

    if (!inputText) return;

    loading.style.display = 'block';
    outputDiv.innerHTML = '';
    copyBtn.style.display = 'none';

    setTimeout(() => {
        const result = karaokeToLao(inputText);

        outputDiv.innerText = result;
        loading.style.display = 'none';
        copyBtn.style.display = 'block';
        
        // เพิ่มเอฟเฟกต์ fade-in
        outputDiv.classList.add('fade-in');
        setTimeout(() => outputDiv.classList.remove('fade-in'), 300);
    }, 200);
}

function clearText() {
    document.getElementById('inputText').value = '';
    document.getElementById('output').innerText = '';
    document.getElementById('copyBtn').style.display = 'none';
}

function copyOutput() {
    const outputText = document.getElementById("output").textContent;
    navigator.clipboard.writeText(outputText)
        .then(() => {
            const copyBtn = document.getElementById("copyBtn");
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> ຄັດລອກແລ້ວ!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> ຄັດລອກຜົນແປ';
                }, 2000);
            }
        })
        .catch(err => {
            console.error("Failed to copy text:", err);
        });
}

// เพิ่ม event listeners เมื่อหน้าเว็บโหลด
document.addEventListener('DOMContentLoaded', function() {
    // ตั้งค่าปุ่มแปลภาษา
    document.getElementById('translateBtn').addEventListener('click', translateText);
    document.getElementById('clearBtn').addEventListener('click', clearText);
    document.getElementById('copyBtn').addEventListener('click', copyOutput);
    
    // อัพเดตจำนวนผู้เยี่ยมชม
    updateVisitorCount();
});