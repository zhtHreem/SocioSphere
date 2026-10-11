import React from 'react';
import { Box } from '@mui/material';
import FormDetailsModal from '../Society/displayform';
import { PersonAvatar } from '../Chat/chat';

const display = '"Bricolage Grotesque", sans-serif';
const STATUS = {
  Accepted: { label: 'Accepted', bg: 'rgba(15,191,143,.14)', fg: '#0A7A5D' },
  Rejected: { label: 'Not this time', bg: 'rgba(224,51,74,.12)', fg: '#b3202f' },
  Submitted: { label: 'Under review', bg: 'rgba(47,92,255,.12)', fg: '#1f43d1' },
  'Under Review': { label: 'Under review', bg: 'rgba(47,92,255,.12)', fg: '#1f43d1' },
};

const ApplicationTracker = ({ societies, selectedTab, handleTabChange, selectedSociety, handleFormSelect, selectedForm, isModalOpen, setIsModalOpen }) => {
  if (!societies || societies.length === 0) {
    return <Box sx={{ color: 'text.secondary' }}>No applications to review yet. New ones will appear here.</Box>;
  }

  const forms = selectedSociety?.forms || [];

  return (
    <Box>
      {/* one pill per society */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
        {societies.map((society) => {
          const active = selectedTab === society.name;
          return (
            <Box key={society._id} component="button" onClick={(e) => handleTabChange(e, society.name)} sx={{ border: 0, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, px: 2, py: 0.9, borderRadius: 999, fontWeight: 800, fontSize: 14.5, background: active ? 'var(--ink)' : '#fff', color: active ? '#fff' : 'var(--ink)', boxShadow: active ? 'none' : 'inset 0 0 0 1.5px rgba(18,20,24,.12)' }}>{society.name}</Box>
          );
        })}
      </Box>

      {forms.length === 0 ? (
        <Box sx={{ py: 4, color: 'text.secondary' }}>No applications yet for {selectedSociety?.name}.</Box>
      ) : (
        <Box>
          {forms.map((form, index) => {
            const st = STATUS[form.status] || { label: form.status || 'Pending', bg: 'rgba(18,20,24,.08)', fg: 'var(--ink)' };
            const name = form.userId?.username || 'Unknown applicant';
            return (
              <Box key={form._id || index} component="button" onClick={() => handleFormSelect(form)} sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', textAlign: 'left', border: 0, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', py: 1.8, borderBottom: '1px solid rgba(18,20,24,.1)', '&:hover': { background: 'rgba(18,20,24,.03)' } }}>
                <PersonAvatar name={name} size={42} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 19 }}>{name}</Box>
                  <Box sx={{ color: 'text.secondary', fontSize: 14 }}>{form.position ? `For ${form.position} · ` : ''}{new Date(form.submittedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</Box>
                </Box>
                <Box sx={{ px: 1.5, py: 0.5, borderRadius: 999, fontWeight: 800, fontSize: 13, background: st.bg, color: st.fg, whiteSpace: 'nowrap' }}>{st.label}</Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Form Details Modal */}
      {selectedForm && (
        <FormDetailsModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={selectedForm}
          societyId={selectedSociety._id}
          userId={selectedForm.userId}
          positions={selectedForm.position}
        />
      )}
    </Box>
  );
};

export default ApplicationTracker;
