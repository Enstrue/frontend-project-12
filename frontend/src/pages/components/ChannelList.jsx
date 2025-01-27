// components/ChannelList.js
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ChannelList = ({
  channels, currentChannel, setCurrentChannel, setModalType, setSelectedChannel,
}) => {
  const { t } = useTranslation();

  const isProtectedChannel = (channel) => ['general', 'random'].includes(channel.name);

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('chat.channels')}</b>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => setModalType('add')}
          aria-label="Каналы"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
        </button>
      </div>

      <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map((channel) => {
          const isActive = currentChannel === channel.id;
          const hasDropdown = !isProtectedChannel(channel);

          return (
            <li key={channel.id} className="nav-item w-100">
              {hasDropdown ? (
                <Dropdown as="div" className={`btn-group w-100 custom-dropdown ${isActive ? 'active' : ''}`}>
                  <button
                    type="button"
                    className={`w-100 rounded-0 text-start text-truncate ${isActive ? 'btn btn-secondary' : 'btn'}`}
                    onClick={() => setCurrentChannel(channel.id)}
                  >
                    <span className="me-1">#</span>
                    {channel.name}
                  </button>
                  <Dropdown.Toggle
                    split
                    variant={isActive ? 'secondary' : 'light'}
                    id={`dropdown-split-${channel.id}`}
                  />
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => { setModalType('rename'); setSelectedChannel(channel); }}>
                      {t('chat.renameChannel')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => { setModalType('delete'); setSelectedChannel(channel); }}>
                      {t('chat.delete')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentChannel(channel.id)}
                  className={`w-100 rounded-0 text-start btn ${isActive ? 'btn-secondary' : ''}`}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChannelList;
