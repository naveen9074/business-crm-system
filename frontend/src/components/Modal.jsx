import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default', // default, danger, success, warning
  size = 'md', // sm, md, lg
  isLoading = false,
  disableConfirm = false,
  showHeader = true,
  showFooter = true,
  closeOnBackdropClick = true,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  };

  const typeClasses = {
    default: {
      icon: null,
      headerBg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      confirmBtn: 'bg-indigo-600 hover:bg-indigo-700',
    },
    danger: {
      icon: AlertTriangle,
      headerBg: 'bg-gradient-to-r from-red-600 to-red-700',
      confirmBtn: 'bg-red-600 hover:bg-red-700',
    },
    success: {
      icon: CheckCircle,
      headerBg: 'bg-gradient-to-r from-green-600 to-green-700',
      confirmBtn: 'bg-green-600 hover:bg-green-700',
    },
    warning: {
      icon: AlertCircle,
      headerBg: 'bg-gradient-to-r from-amber-600 to-amber-700',
      confirmBtn: 'bg-amber-600 hover:bg-amber-700',
    },
  };

  const config = typeClasses[type] || typeClasses.default;
  const IconComponent = config.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-modal-overlay"
        onClick={() => closeOnBackdropClick && onClose()}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`glass-modal w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col animate-modal-content`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {showHeader && (
            <div className={`${config.headerBg} text-white p-6 flex items-center justify-between rounded-t-[1.5rem]`}>
              <div className="flex items-center gap-4">
                {IconComponent && (
                  <div className="p-2 bg-white/20 rounded-lg">
                    <IconComponent size={24} />
                  </div>
                )}
                <h2 className="text-xl font-bold">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="border-t border-gray-200/50 bg-gray-50/50 p-6 flex gap-3 justify-end rounded-b-[1.5rem]">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2.5 font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              {onConfirm && (
                <button
                  onClick={onConfirm}
                  disabled={isLoading || disableConfirm}
                  className={`px-6 py-2.5 font-medium rounded-lg text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${config.confirmBtn}`}
                >
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {confirmText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
