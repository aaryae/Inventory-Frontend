import {
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import { useState } from 'react';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const inventory = [
    {
      id: 1,
      name: 'Laptop Dell XPS 13',
      sku: 'LAP-001',
      category: 'Electronics',
      stock: 15,
      price: 1299.99,
      status: 'In Stock',
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      name: 'Wireless Mouse Logitech',
      sku: 'ACC-002',
      category: 'Accessories',
      stock: 2,
      price: 29.99,
      status: 'Low Stock',
      lastUpdated: '1 day ago'
    },
    {
      id: 3,
      name: 'USB-C Cable',
      sku: 'CAB-003',
      category: 'Cables',
      stock: 0,
      price: 12.99,
      status: 'Out of Stock',
      lastUpdated: '3 days ago'
    },
    {
      id: 4,
      name: 'External Hard Drive 1TB',
      sku: 'STO-004',
      category: 'Storage',
      stock: 8,
      price: 89.99,
      status: 'In Stock',
      lastUpdated: '5 hours ago'
    },
    {
      id: 5,
      name: 'Bluetooth Headphones',
      sku: 'AUD-005',
      category: 'Audio',
      stock: 25,
      price: 149.99,
      status: 'In Stock',
      lastUpdated: '1 hour ago'
    }
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-900 text-green-200';
      case 'Low Stock':
        return 'bg-yellow-900 text-yellow-200';
      case 'Out of Stock':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-[#21222d] text-slate-300';
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg" style={{ background: "#171821" }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Inventory Management</h1>
            <p className="text-slate-400 mt-2">Manage your product inventory and stock levels</p>
          </div>
          <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg" style={{ background: "#171821" }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search items by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 border border-[#21222d]"
                style={{ background: "#21222d" }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 border border-[#21222d]"
              style={{ background: "#21222d" }}
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Cables">Cables</option>
              <option value="Storage">Storage</option>
              <option value="Audio">Audio</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 border border-[#21222d]"
              style={{ background: "#21222d" }}
            >
              <option value="all">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-[#21222d] shadow-lg overflow-hidden" style={{ background: "#171821" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#21222d" }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21222d]">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-[#21222d] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-100">{item.name}</div>
                      <div className="text-sm text-slate-400">SKU: {item.sku}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-slate-300" style={{ background: "#21222d" }}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-100">{item.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-100">${item.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {item.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-cyan-400 hover:text-cyan-300 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300 p-1">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="p-6 border-t border-[#21222d]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-lg p-4 border border-[#21222d]" style={{ background: "#21222d" }}>
              <div className="text-sm text-slate-400">Total Items</div>
              <div className="text-2xl font-bold text-slate-100">{inventory.length}</div>
            </div>
            <div className="rounded-lg p-4 border border-[#21222d]" style={{ background: "#21222d" }}>
              <div className="text-sm text-slate-400">In Stock</div>
              <div className="text-2xl font-bold text-green-400">
                {inventory.filter(item => item.status === 'In Stock').length}
              </div>
            </div>
            <div className="rounded-lg p-4 border border-[#21222d]" style={{ background: "#21222d" }}>
              <div className="text-sm text-slate-400">Low Stock</div>
              <div className="text-2xl font-bold text-yellow-400">
                {inventory.filter(item => item.status === 'Low Stock').length}
              </div>
            </div>
            <div className="rounded-lg p-4 border border-[#21222d]" style={{ background: "#21222d" }}>
              <div className="text-sm text-slate-400">Out of Stock</div>
              <div className="text-2xl font-bold text-red-400">
                {inventory.filter(item => item.status === 'Out of Stock').length}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-[#21222d]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing {filteredInventory.length} of {inventory.length} items
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-[#21222d] border border-[#21222d]" style={{ background: "#171821" }}>
                Previous
              </button>
              <button className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 border border-transparent rounded-lg text-sm text-white">
                1
              </button>
              <button className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-[#21222d] border border-[#21222d]" style={{ background: "#171821" }}>
                2
              </button>
              <button className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-[#21222d] border border-[#21222d]" style={{ background: "#171821" }}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory; 