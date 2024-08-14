import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactJson from 'react-json-view';

interface PopupOptions {
  apiEndpoint: string; // API để lấy dữ liệu cho select
  onSubmit?: (mappedData: Record<string, any>) => void; // Callback để trả về dữ liệu mapping
  getObjectEndpoint: (selectedId: string) => string; // Hàm để lấy endpoint từ option được chọn
}

const PopupSDK: React.FC<PopupOptions> = ({ apiEndpoint, onSubmit, getObjectEndpoint }) => {
  const [selectOptions, setSelectOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<Record<string, any> | null>(null);
  const [mappedData, setMappedData] = useState<Record<string, any>>({});

  useEffect(() => {
    // Gọi API đầu tiên để lấy dữ liệu cho select
    const fetchSelectOptions = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        console.log('data =>', data);

        setSelectOptions(data); // Giả sử data là một array các object có { id, name }
      } catch (error) {
        console.error('Error fetching select options:', error);
      }
    };
    fetchSelectOptions();
  }, [apiEndpoint]);

  useEffect(() => {
    // Khi option được chọn, gọi API để lấy dữ liệu JSON
    const fetchSelectedObject = async () => {
      if (!selectedOption) return;

      try {
        const response = await fetch(getObjectEndpoint(selectedOption));
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    fetchSelectedObject();
  }, [selectedOption, getObjectEndpoint]);

  const handleMappingChange = (updatedSrc: any) => {
    setMappedData(updatedSrc);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(mappedData); // Trả về dữ liệu mapping sau khi submit
    }
  };

  return (
    <div
      className="card"
      style={{
        width: '800px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        zIndex: 10000,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
      }}
    >
      <div style={{ padding: '10px' }}>
        <h5>Select Option</h5>
        <select
          className="form-select mb-3"
          onChange={(e) => setSelectedOption(e.target.value)}
          value={selectedOption || ''}
        >
          <option value="" disabled>
            Select an option
          </option>
          {selectOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* API JSON Data Area */}
        <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #ccc', overflow: 'auto' }}>
          <h5>API JSON Data</h5>
          {jsonData ? (
            <ReactJson src={jsonData} theme="monokai" collapsed={false} />
          ) : (
            <p>Select an option to view JSON data...</p>
          )}
        </div>

        {/* Mapping Area */}
        <div style={{ flex: 1, padding: '10px', overflow: 'auto' }}>
          <h5>Mapping Area</h5>
          <ReactJson
            src={mappedData}
            theme="rjv-default"
            collapsed={false}
            onEdit={(edit) => handleMappingChange(edit.updated_src)}
            onAdd={(add) => handleMappingChange(add.updated_src)}
            onDelete={(del) => handleMappingChange(del.updated_src)}
          />
        </div>
      </div>

      <div style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

const createPopup = (options: PopupOptions, containerId: string) => {
  const container = document.getElementById(containerId);
  if (container) {
    const root = ReactDOM.createRoot(container);
    container.style.display = 'block';
    root.render(<PopupSDK {...options} />);
  }
};

export default createPopup;