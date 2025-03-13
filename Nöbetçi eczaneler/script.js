document.addEventListener('DOMContentLoaded', () => {
    // Türkçe gün ve ay isimleri
    const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    
    // Tarih gösterimini güncelle
    function updateDate() {
        const now = new Date();
        const dateText = document.getElementById('date-text');
        const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${days[now.getDay()]}`;
        dateText.textContent = formattedDate;
    }
    
    updateDate();
    
    // Telefon numarasını aranabilir formata dönüştür
    function formatPhoneNumber(phoneNumber) {
        // Boşlukları ve özel karakterleri kaldır
        return phoneNumber.replace(/\s+/g, '').replace(/[^\d]/g, '');
    }
    
    // Eczane kartını oluştur
    function createEczaneCard(eczane) {
        // Temiz telefon numarası
        const cleanPhone = formatPhoneNumber(eczane.telefon);
        
        return `
            <div class="eczane">
                <div class="eczane-header">
                    <div class="eczane-icon">
                    </div>
                    <h3>${eczane.isim}</h3>
                </div>
                <div class="eczane-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${eczane.adres}</p>
                    <p><i class="fas fa-phone-alt"></i> <span class="eczane-telefon">${eczane.telefon}</span></p>
                </div>
                <div class="eczane-actions">
                    <a href="tel:${cleanPhone}" class="action-btn call-btn"><i class="fas fa-phone"></i> Ara</a>
                    <a href="https://maps.google.com/?q=${encodeURIComponent(eczane.adres + ' ' + eczane.ilce + ' Denizli')}" target="_blank" class="action-btn map-btn"><i class="fas fa-map-marked-alt"></i> Harita</a>
                </div>
            </div>
        `;
    }
    
    // Nöbetçi eczaneleri getir
    async function getNobetciEczaneler() {
        try {
            const response = await fetch('api.php'); // PHP dosyasının URL'i
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data.error) {
                console.error('Veri çekme hatası:', data.error);
                showError('pamukkale-eczane-container', 'Veri çekme hatası: ' + data.error);
                showError('merkezefendi-eczane-container', 'Veri çekme hatası: ' + data.error);
                return;
            }
            
            // Pamukkale Eczanelerini Listele
            const pamukkaleContainer = document.getElementById('pamukkale-eczane-container');
            if (pamukkaleContainer) {
                if (data.pamukkale && data.pamukkale.length > 0) {
                    pamukkaleContainer.innerHTML = data.pamukkale.map(eczane => createEczaneCard(eczane)).join('');
                } else {
                    pamukkaleContainer.innerHTML = '<div class="error-message">Pamukkale için nöbetçi eczane bulunamadı.</div>';
                }
            } else {
                console.error('Pamukkale eczane container bulunamadı!');
            }
            
            // Merkezefendi Eczanelerini Listele
            const merkezefendiContainer = document.getElementById('merkezefendi-eczane-container');
            if (merkezefendiContainer) {
                if (data.merkezefendi && data.merkezefendi.length > 0) {
                    merkezefendiContainer.innerHTML = data.merkezefendi.map(eczane => createEczaneCard(eczane)).join('');
                } else {
                    merkezefendiContainer.innerHTML = '<div class="error-message">Merkezefendi için nöbetçi eczane bulunamadı.</div>';
                }
            } else {
                console.error('Merkezefendi eczane container bulunamadı!');
            }
            
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            showError('pamukkale-eczane-container', 'Veri çekme hatası: ' + error.message);
            showError('merkezefendi-eczane-container', 'Veri çekme hatası: ' + error.message);
        }
    }
    
    // Hata mesajı göster
    function showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
    
    // İlk yükleme
    getNobetciEczaneler();
    
    // Her saat başı güncelle
    setInterval(() => {
        updateDate();
        getNobetciEczaneler();
    }, 3600000); // 60 dakika = 3600000 ms
});