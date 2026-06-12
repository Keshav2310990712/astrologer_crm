import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ClientFormModal from '../components/ClientFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { 
  Plus, Search, Edit2, Trash2, Calendar, Clock, MapPin, UserPlus, ChevronLeft, ChevronRight, RefreshCw, Phone, Mail, Sparkles 
} from 'lucide-react';

const Clients = () => {
  const { showToast } = useToast();
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination State
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 10 });

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/clients', {
        params: {
          search: searchQuery,
          page: page,
          limit: 10
        }
      });
      if (response.data.success) {
        setClients(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Fetch clients error:', err);
      showToast('Failed to align client records. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchQuery, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on new search
    setSearchQuery(search);
  };

  const handleRefresh = () => {
    fetchClients();
    showToast('Client registry synchronized with database.', 'info');
  };

  const handleAddClick = () => {
    setSelectedClient(null);
    setFormOpen(true);
  };

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setFormOpen(true);
  };

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;
    setDeleting(true);
    try {
      const response = await api.delete(`/clients/${selectedClient._id}`);
      if (response.data.success) {
        showToast(`Client "${selectedClient.name}" has been deleted.`, 'success');
        setDeleteOpen(false);
        setSelectedClient(null);
        if (clients.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchClients();
        }
      }
    } catch (err) {
      console.error('Delete client error:', err);
      showToast(err.response?.data?.message || 'Failed to delete client', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden cosmic-bg">
      {/* Background glowing effects */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cosmic-500/5 blur-[120px] top-0 right-0  pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px] bottom-0 left-0  pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-fade-in font-sans">
        {/* Header Title Section */}
        <div className="sm:flex sm:items-center sm:justify-between border-b border-cosmic-900/50 pb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold leading-7 text-slate-100 sm:text-4xl tracking-wide flex items-center gap-2">
              Client Registry <Sparkles className="h-6 w-6 text-gold-400 animate-float" />
            </h1>
            <p className="mt-2 text-sm text-cosmic-300/60">
              Manage your client charts, contact details, and stellar alignments.
            </p>
          </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4 gap-2">
            <Button 
              variant="secondary"
              onClick={handleRefresh}
              className="px-3"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              onClick={handleAddClick}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" /> Register Client
            </Button>
          </div>
        </div>

        {/* Search Filter Panel */}
        <Card className="p-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30"
                placeholder="Search clients by name, email, or phone..."
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
            >
              Filter
            </Button>
          </form>
        </Card>

        {/* Client List Grid / Table */}
        <Card className="p-0 overflow-hidden border border-cosmic-800/30 shadow-2xl">
          {loading ? (
            <div className="py-24">
              <Spinner size="lg" />
              <p className="text-xs text-cosmic-400 uppercase tracking-widest text-center mt-4 animate-pulse">Consulting files...</p>
            </div>
          ) : clients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-cosmic-900/40 text-left text-sm">
                <thead>
                  <tr className="bg-cosmic-950/40 text-cosmic-300/60 uppercase text-[10px] tracking-wider font-semibold border-b border-cosmic-900/40">
                    <th className="px-6 py-4">Client Detail</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4 hidden md:table-cell">Date of Birth</th>
                    <th className="px-6 py-4 hidden lg:table-cell">Time & Place of Birth</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cosmic-900/10">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-cosmic-900/10 transition-colors group">
                      {/* Name / Email */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cosmic-600/20 to-gold-500/20 text-gold-300 border border-cosmic-500/10 flex items-center justify-center font-bold text-sm uppercase shadow-inner group-hover:scale-105 transition-transform duration-200">
                            {client.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-200 group-hover:text-gold-200 transition-colors">
                              {client.name}
                            </div>
                            <div className="text-xs text-cosmic-400/80 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3.5 h-3.5 text-cosmic-500" /> {client.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        {client.phone ? (
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-cosmic-400" />
                            {client.phone}
                          </span>
                        ) : (
                          <span className="text-cosmic-300/35 italic text-xs">Not added</span>
                        )}
                      </td>

                      {/* DOB */}
                      <td className="px-6 py-4.5 whitespace-nowrap hidden md:table-cell">
                        {client.dateOfBirth ? (
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-cosmic-400" />
                            {formatDate(client.dateOfBirth)}
                          </span>
                        ) : (
                          <span className="text-cosmic-300/35 italic text-xs">Not added</span>
                        )}
                      </td>

                      {/* TOB / POB */}
                      <td className="px-6 py-4.5 hidden lg:table-cell max-w-xs truncate">
                        {(client.timeOfBirth || client.placeOfBirth) ? (
                          <div className="space-y-0.5">
                            {client.timeOfBirth && (
                              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-cosmic-400" /> {client.timeOfBirth}
                              </div>
                            )}
                            {client.placeOfBirth && (
                              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-cosmic-500" /> {client.placeOfBirth}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-cosmic-300/35 italic text-xs">Not added</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-right font-sans">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(client)}
                            className="p-1.5 rounded-lg text-cosmic-400 hover:text-gold-300 hover:bg-cosmic-900/40 border border-transparent hover:border-cosmic-800/30 transition-all duration-200"
                            title="Edit Client details"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(client)}
                            className="p-1.5 rounded-lg text-cosmic-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/20 transition-all duration-200"
                            title="Delete Client"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center max-w-sm mx-auto text-center px-4">
              <div className="p-4 rounded-2xl bg-cosmic-950/60 border border-cosmic-800/40 text-cosmic-400 mb-4 animate-float">
                <UserPlus className="h-10 w-10 text-gold-400" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Empty Client Directory</h3>
              <p className="text-xs text-cosmic-300/50 mt-1 leading-relaxed">
                {searchQuery 
                  ? "No client records match your current search filters. Try refining your parameters." 
                  : "You haven't onboarded any clients under your profile yet. Book a registration to begin."
                }
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleAddClick}
                  className="mt-5"
                  size="sm"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Onboard First Client
                </Button>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {(!loading && pagination.pages > 1) && (
            <div className="px-6 py-4 bg-cosmic-950/30 border-t border-cosmic-900/40 flex items-center justify-between">
              <span className="text-xs text-cosmic-300/40">
                Displaying page <strong className="text-slate-300">{pagination.page}</strong> of <strong className="text-slate-300">{pagination.pages}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-cosmic-800/40 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                  className="p-1.5 rounded-lg border border-cosmic-800/40 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Form Dialog Modal */}
      <ClientFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        clientData={selectedClient}
        onSave={fetchClients}
      />

      {/* Delete Dialog Confirmation */}
      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        clientName={selectedClient?.name || ''}
        loading={deleting}
      />
    </div>
  );
};

export default Clients;
