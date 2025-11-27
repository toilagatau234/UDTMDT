import React, { useEffect, useRef } from 'react';

/**
 * Component Modal tái sử dụng, tích hợp Bootstrap 5 JS
 * @param {object} props
 * @param {string} props.id - ID duy nhất cho modal
 * @param {string} props.title - Tiêu đề của modal
 * @param {React.ReactNode} props.children - Nội dung (body) của modal
 * @param {React.ReactNode} props.footer - Nội dung (footer) của modal
 * @param {function} props.onClose - Hàm được gọi khi modal đóng
 * @param {boolean} props.show - State (true/false) để điều khiển đóng/mở modal
 */
const Modal = ({ id, title, children, footer, show, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!modalRef.current) {

      modalRef.current = document.getElementById(id);
      
      // Thêm listener 'hidden.bs.modal' (khi modal đã đóng hoàn toàn)
      modalRef.current.addEventListener('hidden.bs.modal', () => {
        if (onClose) {
          onClose();
        }
      });
    }

    // Lấy instance của Bootstrap Modal
    // eslint-disable-next-line no-undef
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalRef.current);

    if (show) {
      bsModal.show();
    } else {
      bsModal.hide();
    }

  }, [id, show, onClose]);

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => onClose()} // Yêu cầu đóng modal
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;