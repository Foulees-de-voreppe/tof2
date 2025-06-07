document.addEventListener('DOMContentLoaded', () => {
      const video = document.getElementById('video');
      const canvas = document.getElementById('canvas');
      const captureBtn = document.getElementById('capture');
      const retakeBtn = document.getElementById('retake');
      const uploadBtn = document.getElementById('upload');
      const resultDiv = document.getElementById('result');
      
      if (!video || !canvas || !captureBtn || !retakeBtn || !uploadBtn || !resultDiv) {
        console.error('Un élément essentiel est manquant dans le DOM');
        return;
      }
      
      let photoData = null;
      let stream = null;
      
      async function startCamera() {
        try {
          // Détection mobile
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: isMobile ? 1280 : 1920 },
              height: { ideal: isMobile ? 720 : 1080 }
            },
            audio: false 
          });
          
          video.srcObject = stream;
          video.play();
          
        } catch (err) {
          if (resultDiv) {
            resultDiv.textContent = `Erreur: ${err.message}`;
            resultDiv.style.color = 'red';
          }
          console.error('Erreur caméra:', err);
        }
      }
      
      function capturePhoto() {
        try {
          // Ajuster la taille du canvas à la vidéo
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          
          // Dessiner l'image sur le canvas
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, videoWidth, videoHeight);
          
          // Obtenir la photo en base64
          photoData = canvas.toDataURL('image/jpeg', 0.8);
          
          // Basculer l'affichage
          video.style.display = 'none';
          canvas.style.display = 'block';
          
          // Mettre à jour les boutons
          captureBtn.disabled = true;
          retakeBtn.disabled = false;
          uploadBtn.disabled = false;
          
        } catch (err) {
          if (resultDiv) {
            resultDiv.textContent = 'Erreur lors de la capture';
            resultDiv.style.color = 'red';
          }
          console.error('Erreur capture:', err);
        }
      }
      
      // Gestion des événements pour mobile et desktop
      captureBtn.addEventListener('click', capturePhoto);
      captureBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        capturePhoto();
      });
      
      retakeBtn.addEventListener('click', () => {
        video.style.display = 'block';
        canvas.style.display = 'none';
        captureBtn.disabled = false;
        retakeBtn.disabled = true;
        uploadBtn.disabled = true;
      });
      
      uploadBtn.addEventListener('click', async () => {
        if (!photoData) return;
        
        try {
          resultDiv.textContent = 'Envoi en cours...';
          resultDiv.style.color = 'black';
          
          const blob = await fetch(photoData).then(res => res.blob());
          const formData = new FormData();
          formData.append('file', blob, 'photo.jpg');
          
          const response = await fetch('https://script.google.com/macros/s/AKfycbzbdC-60zvJpOXhWBIgV3kdkIjI1u5M0m-5tajQrpWbrMOHfeNYWuBcflraX_5T4rr4/exec', {
            method: 'POST',
            body: formData
          });
          
          const result = await response.text();
          resultDiv.textContent = 'Photo envoyée avec succès!';
          resultDiv.style.color = 'green';
          
        } catch (err) {
          if (resultDiv) {
            resultDiv.textContent = `Erreur lors de l'envoi: ${err.message}`;
            resultDiv.style.color = 'red';
          }
        }
      });
      
      // Démarrer la caméra
      startCamera();
    });
