import { createContext, useContext, useState } from "react";

const ShareReportModalContext = createContext();

export const ShareReportModalProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const openReportModal = (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      const modal = document.getElementById("report");
      if (modal) modal.showModal();
    }, 0);
  };

  const closeReportModal = () => {
    setSelectedItem(null);
    document.getElementById("report").close();
  };

  const openShareModal = (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      const modal = document.getElementById("share");
      if (modal) modal.showModal();
    }, 0);
  };
  
  const closeShareModal = () => {
    setSelectedItem(null);
    document.getElementById("share").close();
  };

  return (
    <ShareReportModalContext.Provider
      value={{ selectedItem, openReportModal, closeReportModal, openShareModal, closeShareModal }}
    >
      {children}
    </ShareReportModalContext.Provider>
  );
};

export const useShareReportModal = () => useContext(ShareReportModalContext);
