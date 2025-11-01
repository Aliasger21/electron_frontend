import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, title = 'Confirm', message, onConfirm, onCancel, confirmText = 'Yes', cancelText = 'Cancel' }) => {
    return (
        <Modal show={show} onHide={onCancel} centered>
            {title && <Modal.Header closeButton><Modal.Title>{title}</Modal.Title></Modal.Header>}
            <Modal.Body>
                <p style={{ margin: 0 }}>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>{cancelText}</Button>
                <Button variant="danger" onClick={onConfirm}>{confirmText}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;


