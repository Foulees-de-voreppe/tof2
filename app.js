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
          if (!resultDiv) return;
          
          const permissions = await navigator.permissions.query({ name: 'camera' });
          
          if (permissions.state === 'denied') {
            resultDiv.textContent = 'Permission refusée. Veuillez autoriser la caméra.';
            resultDiv.style.color = 'red';
            return;
          }
          
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false 
          });
          
          video.srcObject = stream;
          
        } catch (err) {
          if (resultDiv) {
            if (err.name === 'NotAllowedError') {
              resultDiv.textContent = 'Permission refusée. Veuillez autoriser l\'accès à la caméra.';
            } else if (err.name === 'NotFoundError') {
              resultDiv.textContent = 'Aucun périphérique de capture trouvé.';
            } else {
              resultDiv.textContent = `Erreur: ${err.message}`;
            }
            resultDiv.style.color = 'red';
          }
          console.error('Erreur caméra:', err);
        }
      }
      
      // ... (le reste du code reste inchangé) ...
      
      startCamera();
    });
