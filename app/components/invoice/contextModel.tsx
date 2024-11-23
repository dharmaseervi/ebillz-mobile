import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);

  const openCustomerModal = () => setCustomerModalVisible(true);
  const closeCustomerModal = () => setCustomerModalVisible(false);

  const openItemModal = () => setItemModalVisible(true);
  const closeItemModal = () => setItemModalVisible(false);

  return (
    <ModalContext.Provider value={{
      customerModalVisible, openCustomerModal, closeCustomerModal,
      itemModalVisible, openItemModal, closeItemModal
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
