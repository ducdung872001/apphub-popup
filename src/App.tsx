import React from 'react';
import createPopup from './PopupSDK';

const App: React.FC = () => {
  const apiEndpoint = 'http://127.0.0.1:5000/api/select-options'; // API để lấy dữ liệu cho select

  const getObjectEndpoint = (selectedId: string) => {
    return `http://127.0.0.1:5000/api/object/${selectedId}`; // API để lấy JSON object
  };

  const handleShowPopup = () => {
    const container = document.getElementById('popupContainer');
    if (container) {
      container.style.display = 'block'; // Hiển thị container
    }

    createPopup(
      {
        apiEndpoint,
        getObjectEndpoint,
        onSubmit: (mappedData) => {
          console.log('Mapped Data:', mappedData); // Xử lý dữ liệu đã được mapping ở đây

        },
      },
      'popupContainer'
    );
  };

  return (
    <div className="container mt-5">
      <button onClick={handleShowPopup} className="btn btn-primary">
        Show Popup
      </button>
      <div id="popupContainer" style={{ position: 'relative', display: 'none' }}></div>
    </div>
  );
};

export default App;