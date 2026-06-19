// Admin core logic for Supabase Interactions

let quillLongDesc, quillFeatures, quillSpecs;

async function mergeSettings(patch) {
  const { data: existing } = await supabaseClient.from('settings').select('*').eq('id', 'global').single();
  const merged = { ...(existing || {}), ...patch, id: 'global' };
  return await supabaseClient.from('settings').upsert(merged);
}

document.addEventListener("DOMContentLoaded", () => {
  const isDashboard = window.location.pathname.includes('dashboard');
  const isProducts = window.location.pathname.includes('products');
  const isOrders = window.location.pathname.includes('orders');

  if (isDashboard) {
    loadDashboardStats();
  }

  if (isProducts) {
    quillLongDesc = new Quill('#p-long-desc', { theme: 'snow' });
    quillFeatures = new Quill('#p-features', { theme: 'snow' });
    quillSpecs = new Quill('#p-specs', { theme: 'snow' });
    
    loadProducts();
    setupProductForm();
  }

  if (isOrders) {
    loadOrders();
  }
});

// --- Dashboard ---
async function loadDashboardStats() {
  try {
    // Products count
    const { count: productsCount, error: productsError } = await supabaseClient.from('products').select('*', { count: 'exact', head: true });
    if (!productsError) {
      document.getElementById('stat-products').textContent = productsCount || 0;
    }

    // Orders and Revenue
    const { data: orders, error: ordersError } = await supabaseClient.from('orders').select('*');
    if (!ordersError && orders) {
      let totalOrders = orders.length;
      let pendingCount = 0;
      let totalRevenue = 0;

      orders.forEach(order => {
        if (order.status === 'Pending') pendingCount++;
        if (order.status === 'Delivered') totalRevenue += order.total || 0;
      });

      document.getElementById('stat-orders').textContent = totalOrders;
      document.getElementById('stat-pending').textContent = pendingCount;
      document.getElementById('stat-revenue').textContent = `Rs. ${totalRevenue.toLocaleString()}`;

      // Load recent orders table
      const tbody = document.getElementById('recent-orders-body');
      if (tbody && orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No orders yet</td></tr>';
        return;
      }
      
      const sortedOrders = orders.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

      if(tbody) {
        tbody.innerHTML = sortedOrders.map(order => {
          const itemsStr = order.items ? order.items.map(i => `${i.qty}x ${i.name} (${i.size})`).join('<br>') : '-';
          return `
          <tr>
            <td>#${String(order.id).substring(0,8).toUpperCase()}</td>
            <td>${order.customerName || 'Unknown'}</td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
            <td style="font-size: 13px;">${itemsStr}</td>
            <td>Rs. ${order.total}</td>
            <td><span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span></td>
          </tr>
          `;
        }).join('');
      }
    }
  } catch (err) {
    console.error("Error loading dashboard stats:", err);
  }
}

function getStatusBadgeClass(status) {
  if (status === 'Delivered') return 'badge-success';
  if (status === 'Pending') return 'badge-warning';
  return 'badge-danger'; 
}

// --- Products ---
async function loadProducts() {
  const tbody = document.getElementById('products-table-body');
  if(!tbody) return;

  try {
    const { data: products, error } = await supabaseClient.from('products').select('*').order('created_at', { ascending: false });
    
    if (error) throw error;

    if (!products || products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No products found</td></tr>';
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.imageUrl || '../assets/images/placeholder.png'}" width="50" style="border-radius:4px;"/></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.size || '1L'} - ${p.color.toUpperCase()}</td>
        <td>Rs. ${p.offerPrice || 0}</td>
        <td><span class="badge ${p.inStock ? 'badge-success' : 'badge-danger'}">${p.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
        <td>
          <div style="display:flex; gap:8px;">
            <button class="btn-sm" onclick="editProduct('${p.id}')" style="background:#0D47A1;">Edit</button>
            <button class="btn-sm" onclick="duplicateProduct('${p.id}')" style="background:#4CAF50;">Duplicate</button>
            <button class="btn-sm" onclick="deleteProduct('${p.id}')" style="background:var(--admin-danger);">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

function setupProductForm() {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-product-btn');
    btn.textContent = 'Saving...';
    btn.disabled = true;

    const id = document.getElementById('product-id').value;
    const file = document.getElementById('p-image').files[0];
    
    const productData = {
      name: document.getElementById('p-name').value,
      color: document.getElementById('p-color').value,
      size: document.getElementById('p-size').value,
      regularPrice: Number(document.getElementById('p-regular-price').value),
      offerPrice: Number(document.getElementById('p-offer-price').value),
      shortDescription: document.getElementById('p-short-desc').value,
      longDescription: quillLongDesc.root.innerHTML === '<p><br></p>' ? '' : quillLongDesc.root.innerHTML,
      features: quillFeatures.root.innerHTML === '<p><br></p>' ? '' : quillFeatures.root.innerHTML,
      specifications: quillSpecs.root.innerHTML === '<p><br></p>' ? '' : quillSpecs.root.innerHTML,
      inStock: document.getElementById('p-in-stock').checked
    };

    try {
      const uploadImage = async (imgFile) => {
        if (!imgFile) return null;
        const filePath = `${Date.now()}_${imgFile.name}`;
        const { error: uploadError } = await supabaseClient.storage.from('product-images').upload(filePath, imgFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabaseClient.storage.from('product-images').getPublicUrl(filePath);
        return publicUrl;
      };

      const mainUrl = await uploadImage(file);
      if (mainUrl) productData.imageUrl = mainUrl;

      if (id) {
        const { error } = await supabaseClient.from('products').update(productData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabaseClient.from('products').insert([productData]);
        if (error) throw error;
      }

      document.getElementById('product-modal').classList.remove('active');
      form.reset();
      loadProducts(); // Refresh list
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product: " + error.message);
    } finally {
      btn.textContent = 'Save Product';
      btn.disabled = false;
    }
  });
}

window.editProduct = async function(id) {
  try {
    const { data: doc, error } = await supabaseClient.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    
    if (doc) {
      document.getElementById('product-id').value = doc.id;
      document.getElementById('p-name').value = doc.name;
      document.getElementById('p-color').value = doc.color;
      document.getElementById('p-size').value = doc.size || '1L';
      document.getElementById('p-regular-price').value = doc.regularPrice || '';
      document.getElementById('p-offer-price').value = doc.offerPrice || '';
      document.getElementById('p-short-desc').value = doc.shortDescription || '';
      quillLongDesc.root.innerHTML = doc.longDescription || '';
      quillFeatures.root.innerHTML = doc.features || '';
      quillSpecs.root.innerHTML = doc.specifications || '';
      document.getElementById('p-in-stock').checked = doc.inStock !== false; 
      
      document.getElementById('modal-title').textContent = 'Edit Product';
      document.getElementById('product-modal').classList.add('active');
    }
  } catch (error) {
    console.error("Error editing product:", error);
  }
};

window.duplicateProduct = async function(id) {
  const confirmed = await customConfirm("Are you sure you want to duplicate this product?");
  if (confirmed) {
    try {
      const { data: doc, error } = await supabaseClient.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      
      if (doc) {
        delete doc.id;
        delete doc.created_at;
        doc.name = doc.name + ' (Copy)';
        
        const { error: insertError } = await supabaseClient.from('products').insert([doc]);
        if (insertError) throw insertError;
        
        loadProducts();
      }
    } catch (error) {
      console.error("Error duplicating product:", error);
      alert("Error duplicating product: " + error.message);
    }
  }
};

window.deleteProduct = async function(id) {
  const confirmed = await customConfirm("Are you sure you want to delete this product? This cannot be undone.");
  if (confirmed) {
    try {
      const { error } = await supabaseClient.from('products').delete().eq('id', id);
      if (error) throw error;
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product: " + error.message);
    }
  }
};

// --- Orders ---
async function loadOrders() {
  const tbody = document.getElementById('orders-table-body');
  if(!tbody) return;

  try {
    const { data: orders, error } = await supabaseClient.from('orders').select('*').order('created_at', { ascending: false });
    
    if (error) throw error;

    if (!orders || orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No orders found</td></tr>';
      return;
    }

    let csvData = [["Order ID", "Customer Name", "Phone", "City", "Date", "Items", "Total (Rs)", "Status"]];

    tbody.innerHTML = orders.map(order => {
      const dateStr = order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A';
      const itemsStr = order.items ? order.items.map(i => `${i.qty}x ${i.name} (Size: ${i.size}, Color: ${i.color ? i.color.toUpperCase() : 'N/A'})`).join(' | ') : '';
      const itemsHtml = order.items ? order.items.map(i => `<strong style="font-size:14px;">${i.qty}x ${i.name}</strong><br><span style="color:#bbb; font-size:13px; display:inline-block; margin-top:4px;">Size: <strong>${i.size}</strong><br>Color: <strong>${i.color ? i.color.toUpperCase() : 'N/A'}</strong></span>`).join('<div style="margin-bottom:12px;"></div>') : '';
      
      csvData.push([
        order.id, 
        `"${order.customerName || ''}"`, 
        order.phone || '', 
        `"${order.city || ''}"`, 
        `"${dateStr}"`, 
        `"${itemsStr}"`, 
        order.total, 
        order.status
      ]);

      const itemsHtmlDetailed = order.items ? order.items.map(i => {
        const itemPrice = i.offerPrice || i.price || i.regularPrice || 0;
        return `<li style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <div>
                    <strong style="font-size: 15px;">${i.qty}x ${i.name}</strong><br>
                    <span style="font-size: 14px; color: #bbb; display: inline-block; margin-top: 6px; line-height: 1.6;">
                      Size: <strong>${i.size}</strong><br>
                      Color: <strong>${i.color ? i.color.toUpperCase() : 'N/A'}</strong><br>
                      Price: <strong style="color: white;">Rs. ${itemPrice * i.qty}</strong>
                    </span>
                  </div>
                </li>`;
      }).join('') : 'No items';

      return `
        <tr class="order-main-row">
          <td>#${String(order.id).substring(0,8).toUpperCase()}</td>
          <td>
            <strong>${order.customerName || 'Unknown'}</strong><br>
            <small>${order.phone || ''} | ${order.city || ''}</small>
          </td>
          <td>${dateStr}</td>
          <td style="max-width: 200px; font-size: 13px;">${itemsHtml}</td>
          <td><strong>Rs. ${order.total}</strong></td>
          <td>
            <select class="form-control" style="padding: 5px; width: auto;" onchange="updateOrderStatus('${order.id}', this.value)">
              <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <div style="display:flex; gap:8px;">
              <button class="btn-sm" style="background:#0D47A1;" onclick="toggleOrderDetails('${order.id}')">View</button>
              <button class="btn-sm" style="background:var(--admin-danger);" onclick="deleteOrder('${order.id}')">Delete</button>
            </div>
          </td>
        </tr>
        <tr id="details-${order.id}" style="display:none; background-color: rgba(255,255,255,0.03);">
          <td colspan="7" style="padding: 20px;">
            <div style="display: flex; flex-wrap: wrap; gap: 30px;">
              <div style="flex: 1; min-width: 250px;">
                <h4 style="color:var(--admin-primary); margin-bottom:10px;">Customer Details</h4>
                <p style="margin-bottom:5px;"><strong>Name:</strong> ${order.customerName || 'N/A'}</p>
                <p style="margin-bottom:5px;"><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
                <p style="margin-bottom:5px;"><strong>City:</strong> ${order.city || 'N/A'}</p>
                <p style="margin-bottom:5px;"><strong>Address:</strong> ${order.address || 'N/A'}</p>
              </div>
              <div style="flex: 1; min-width: 250px;">
                <h4 style="color:var(--admin-primary); margin-bottom:10px;">Order Summary</h4>
                <ul style="margin-left: 20px; margin-bottom: 10px; line-height: 1.6;">
                  ${itemsHtmlDetailed}
                </ul>
                <p style="margin-bottom:5px;"><strong>Delivery Method:</strong> ${order.deliveryMethod ? order.deliveryMethod : (order.deliveryFee === 350 ? 'Express Delivery' : (order.deliveryFee === 0 ? 'Self Pickup / Free' : 'Standard Delivery'))}</p>
                <p style="margin-bottom:5px;"><strong>Payment Method:</strong> ${order.paymentMethod || 'Cash on Delivery (COD)'}</p>
                <p style="font-size: 16px; margin-top:10px;"><strong>Total Amount: Rs. ${order.total}</strong></p>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Export CSV logic
    const exportBtn = document.getElementById('export-orders-btn');
    if (exportBtn) {
      exportBtn.onclick = () => {
        let csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    }
  } catch (err) {
    console.error("Error loading orders:", err);
  }
}

window.updateOrderStatus = async function(id, newStatus) {
  try {
    const { error } = await supabaseClient.from('orders').update({ status: newStatus }).eq('id', id);
    if (error) throw error;
  } catch (err) {
    alert("Error updating status: " + err.message);
  }
};

window.deleteOrder = async function(id) {
  const confirmed = await customConfirm("Are you sure you want to delete this order? This cannot be undone.");
  if(confirmed) {
    try {
      const { error } = await supabaseClient.from('orders').delete().eq('id', id);
      if (error) throw error;
      loadOrders();
      if (window.location.pathname.includes('dashboard')) {
        loadDashboardStats();
      }
    } catch (err) {
      alert("Error deleting order: " + err.message);
    }
  }
};

window.toggleOrderDetails = function(id) {
  const detailsRow = document.getElementById(`details-${id}`);
  if (detailsRow) {
    if (detailsRow.style.display === 'none') {
      detailsRow.style.display = 'table-row';
    } else {
      detailsRow.style.display = 'none';
    }
  }
};

window.customConfirm = function(message) {
  return new Promise((resolve) => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.style.zIndex = '9999';

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.style.maxWidth = '400px';
    modal.style.textAlign = 'center';
    modal.style.padding = '35px 25px';
    modal.style.background = '#1a1a1a';
    modal.style.borderRadius = '12px';

    // Header
    const header = document.createElement('h3');
    header.style.color = 'var(--white)';
    header.style.marginBottom = '15px';
    header.style.fontFamily = "'Barlow', sans-serif";
    header.style.textTransform = "uppercase";
    header.style.letterSpacing = "1px";
    header.textContent = 'Please Confirm';

    // Message
    const msg = document.createElement('p');
    msg.style.color = '#ccc';
    msg.style.marginBottom = '25px';
    msg.style.lineHeight = '1.6';
    msg.style.fontSize = '15px';
    msg.textContent = message;

    // Buttons Container
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '15px';
    btnContainer.style.justifyContent = 'center';

    const baseBtnStyle = 'padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; outline: none; transition: all 0.3s ease;';

    const cancelBtn = document.createElement('button');
    cancelBtn.style.cssText = baseBtnStyle + ' background: transparent; border: 1px solid #555; color: #fff;';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onmouseover = () => cancelBtn.style.background = 'rgba(255,255,255,0.1)';
    cancelBtn.onmouseout = () => cancelBtn.style.background = 'transparent';

    const confirmBtn = document.createElement('button');
    confirmBtn.style.cssText = baseBtnStyle + ' background: #E53935; border: 1px solid #E53935; color: #fff;';
    confirmBtn.textContent = 'Yes, Proceed';
    confirmBtn.onmouseover = () => confirmBtn.style.background = '#d32f2f';
    confirmBtn.onmouseout = () => confirmBtn.style.background = '#E53935';

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(confirmBtn);

    modal.appendChild(header);
    modal.appendChild(msg);
    modal.appendChild(btnContainer);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);

    const closeModal = (result) => {
      document.body.removeChild(overlay);
      resolve(result);
    };

    cancelBtn.addEventListener('click', () => closeModal(false));
    confirmBtn.addEventListener('click', () => closeModal(true));
  });
};
