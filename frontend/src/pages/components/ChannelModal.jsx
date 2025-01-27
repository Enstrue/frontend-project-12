import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

const ChannelModal = ({
  modalType,
  setModalType,
  selectedChannel,
  handleAddChannel,
  handleRenameChannel,
  handleRemoveChannel,
  validationSchema,
}) => {
  const { t } = useTranslation();

  const renderContent = () => {
    switch (modalType) {
      case 'add':
        return (
          <Formik initialValues={{ name: '' }} validationSchema={validationSchema} onSubmit={handleAddChannel}>
            {({ errors, touched }) => (
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title>{t('chat.addChannel')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <label htmlFor="name" className="form-label visually-hidden">
                    {t('chat.channelName')}
                  </label>
                  <Field
                    name="name"
                    id="name"
                    className={classNames('form-control', {
                      'is-invalid': touched.name && errors.name,
                      'is-valid': touched.name && !errors.name,
                    })}
                  />
                  {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setModalType(null)}>{t('chat.cancel')}</Button>
                  <Button type="submit" variant="primary">{t('chat.send')}</Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        );
      case 'delete':
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{t('chat.deleteChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{t('chat.confirmDelete')}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalType(null)}>{t('chat.cancel')}</Button>
              <Button variant="danger" onClick={() => { handleRemoveChannel(); setModalType(null); }}>
                {t('chat.delete')}
              </Button>
            </Modal.Footer>
          </>
        );
      case 'rename':
        return (
          <Formik
            initialValues={{ name: selectedChannel?.name || '' }}
            validationSchema={validationSchema}
            onSubmit={({ name }) => handleRenameChannel(name)}
          >
            {({ errors, touched }) => (
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title>{t('chat.renameChannel')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <label htmlFor="name" className="form-label visually-hidden">
                    {t('chat.channelName')}
                  </label>
                  <Field
                    name="name"
                    id="name"
                    className={classNames('form-control', {
                      'is-invalid': touched.name && errors.name,
                      'is-valid': touched.name && !errors.name,
                    })}
                  />
                  {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setModalType(null)}>{t('chat.cancel')}</Button>
                  <Button type="submit" variant="primary">{t('chat.renameChannel')}</Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        );
      default:
        return null;
    }
  };

  return (
    <Modal show={modalType !== null} onHide={() => setModalType(null)}>
      {renderContent()}
    </Modal>
  );
};

export default ChannelModal;
