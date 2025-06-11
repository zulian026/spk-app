"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X, Save, Eye } from "lucide-react";

interface LaptopData {
  id?: number;
  name: string;
  brand: string;
  price: number;
  processor: string;
  processor_score?: number;
  ram: number;
  storage: number;
  storage_type?: string;
  graphics_card?: string;
  graphics_type?: string;
  screen_size: number;
  screen_resolution: string;
  screen_type?: string;
  weight: number;
  thickness?: number;
  battery_capacity?: number;
  battery_life?: number;
  operating_system?: string;
  wifi_standard?: string;
  bluetooth_version?: string;
  usb_ports?: number;
  has_hdmi?: boolean;
  has_usb_c?: boolean;
  image_url?: string;
  description?: string;
  availability_status?: string;
}

const defaultLaptop: LaptopData = {
  name: "",
  brand: "",
  price: 0,
  processor: "",
  processor_score: 0,
  ram: 8,
  storage: 256,
  storage_type: "SSD",
  graphics_card: "",
  graphics_type: "Integrated",
  screen_size: 14,
  screen_resolution: "1920x1080",
  screen_type: "LCD",
  weight: 1.5,
  thickness: 20,
  battery_capacity: 50,
  battery_life: 8,
  operating_system: "Windows 11",
  wifi_standard: "Wi-Fi 6",
  bluetooth_version: "5.0",
  usb_ports: 2,
  has_hdmi: true,
  has_usb_c: true,
  image_url: "",
  description: "",
  availability_status: "available",
};

export default function LaptopCRUDAdmin() {
  const [laptops, setLaptops] = useState<LaptopData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState<LaptopData | null>(null);
  const [formData, setFormData] = useState<LaptopData>(defaultLaptop);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch laptops from API
  const fetchLaptops = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/laptops");
      const result = await response.json();
      if (response.ok) {
        setLaptops(result.data || []);
      } else {
        console.error("Error fetching laptops:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingLaptop
        ? `/api/laptops/${editingLaptop.id}`
        : "/api/laptops";
      const method = editingLaptop ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          editingLaptop
            ? "Laptop berhasil diupdate!"
            : "Laptop berhasil ditambahkan!"
        );
        setShowForm(false);
        setEditingLaptop(null);
        setFormData(defaultLaptop);
        fetchLaptops(); // Refresh data
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus laptop ini?")) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/laptops/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        alert("Laptop berhasil dihapus!");
        fetchLaptops(); // Refresh data
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghapus data");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (laptop: LaptopData) => {
    setEditingLaptop(laptop);
    setFormData(laptop);
    setShowForm(true);
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  // Filter laptops based on search
  const filteredLaptops = laptops.filter(
    (laptop) =>
      laptop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredLaptops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLaptops = filteredLaptops.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manajemen Laptop
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola data laptop dalam sistem
              </p>
            </div>
            <button
              onClick={() => {
                setEditingLaptop(null);
                setFormData(defaultLaptop);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Tambah Laptop
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari laptop berdasarkan nama atau brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laptop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spesifikasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : paginatedLaptops.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada data laptop
                    </td>
                  </tr>
                ) : (
                  paginatedLaptops.map((laptop) => (
                    <tr key={laptop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {laptop.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {laptop.brand}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {laptop.processor} • {laptop.ram}GB RAM •{" "}
                          {laptop.storage}GB {laptop.storage_type}
                        </div>
                        <div className="text-sm text-gray-500">
                          {laptop.screen_size}" • {laptop.weight}kg
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          Rp {laptop.price.toLocaleString("id-ID")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            laptop.availability_status === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {laptop.availability_status === "available"
                            ? "Tersedia"
                            : "Tidak Tersedia"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(laptop)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(laptop.id!)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Menampilkan {startIndex + 1} -{" "}
                  {Math.min(startIndex + itemsPerPage, filteredLaptops.length)}{" "}
                  dari {filteredLaptops.length} data
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingLaptop ? "Edit Laptop" : "Tambah Laptop Baru"}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Laptop *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand *
                      </label>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Pilih Brand</option>
                        <option value="Apple">Apple</option>
                        <option value="Dell">Dell</option>
                        <option value="HP">HP</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Asus">Asus</option>
                        <option value="Acer">Acer</option>
                        <option value="MSI">MSI</option>
                        <option value="Samsung">Samsung</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga (Rp) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Processor *
                      </label>
                      <input
                        type="text"
                        name="processor"
                        value={formData.processor}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Intel Core i7-1365U"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Hardware Specs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RAM (GB) *
                      </label>
                      <select
                        name="ram"
                        value={formData.ram}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={4}>4 GB</option>
                        <option value={8}>8 GB</option>
                        <option value={16}>16 GB</option>
                        <option value={32}>32 GB</option>
                        <option value={64}>64 GB</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage (GB) *
                      </label>
                      <input
                        type="number"
                        name="storage"
                        value={formData.storage}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage Type
                      </label>
                      <select
                        name="storage_type"
                        value={formData.storage_type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="SSD">SSD</option>
                        <option value="HDD">HDD</option>
                        <option value="eMMC">eMMC</option>
                      </select>
                    </div>
                  </div>

                  {/* Display */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Screen Size (inch) *
                      </label>
                      <input
                        type="number"
                        name="screen_size"
                        value={formData.screen_size}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        min="10"
                        max="20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Screen Resolution *
                      </label>
                      <select
                        name="screen_resolution"
                        value={formData.screen_resolution}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="1366x768">1366 x 768 (HD)</option>
                        <option value="1920x1080">1920 x 1080 (Full HD)</option>
                        <option value="1920x1200">1920 x 1200 (WUXGA)</option>
                        <option value="2560x1440">2560 x 1440 (2K)</option>
                        <option value="2560x1664">2560 x 1664 (Retina)</option>
                        <option value="3840x2160">3840 x 2160 (4K)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Screen Type
                      </label>
                      <select
                        name="screen_type"
                        value={formData.screen_type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="LCD">LCD</option>
                        <option value="IPS">IPS</option>
                        <option value="OLED">OLED</option>
                        <option value="Retina">Retina</option>
                      </select>
                    </div>
                  </div>

                  {/* Graphics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Graphics Card
                      </label>
                      <input
                        type="text"
                        name="graphics_card"
                        value={formData.graphics_card}
                        onChange={handleInputChange}
                        placeholder="e.g., NVIDIA RTX 4060"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Graphics Type
                      </label>
                      <select
                        name="graphics_type"
                        value={formData.graphics_type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Integrated">Integrated</option>
                        <option value="Dedicated">Dedicated</option>
                      </select>
                    </div>
                  </div>

                  {/* Physical */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg) *
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        min="0.5"
                        max="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thickness (mm)
                      </label>
                      <input
                        type="number"
                        name="thickness"
                        value={formData.thickness}
                        onChange={handleInputChange}
                        step="0.1"
                        min="5"
                        max="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Connectivity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Operating System
                      </label>
                      <select
                        name="operating_system"
                        value={formData.operating_system}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Windows 11">Windows 11</option>
                        <option value="Windows 10">Windows 10</option>
                        <option value="macOS">macOS</option>
                        <option value="Linux">Linux</option>
                        <option value="Chrome OS">Chrome OS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability Status
                      </label>
                      <select
                        name="availability_status"
                        value={formData.availability_status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="available">Available</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="discontinued">Discontinued</option>
                      </select>
                    </div>
                  </div>

                  {/* Ports */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        USB Ports
                      </label>
                      <input
                        type="number"
                        name="usb_ports"
                        value={formData.usb_ports}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="has_hdmi"
                          checked={formData.has_hdmi}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Has HDMI
                      </label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="has_usb_c"
                          checked={formData.has_usb_c}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Has USB-C
                      </label>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          {editingLaptop ? "Update Laptop" : "Simpan Laptop"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
