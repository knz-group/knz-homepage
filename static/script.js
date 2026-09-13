let currentMachineId = null;

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    loadVendingMachines();
});

// 自動販売機一覧を読み込む
async function loadVendingMachines() {
    try {
        const response = await fetch('/api/vending-machines');
        const machines = await response.json();
        
        const machinesList = document.getElementById('machinesList');
        machinesList.innerHTML = '';
        
        if (machines.length === 0) {
            machinesList.innerHTML = '<p>自動販売機がまだ登録されていません</p>';
            return;
        }
        
        machines.forEach(machine => {
            const button = document.createElement('button');
            button.className = 'machine-button';
            button.textContent = `${machine.name} - ${machine.location}`;
            button.onclick = () => selectMachine(machine.id, button);
            machinesList.appendChild(button);
        });
        
        // 最初の自動販売機を自動選択
        if (machines.length > 0) {
            selectMachine(machines[0].id, machinesList.firstChild);
        }
    } catch (error) {
        console.error('エラー:', error);
        document.getElementById('machinesList').innerHTML = '<p>エラーが発生しました</p>';
    }
}

// 自動販売機を選択
async function selectMachine(machineId, buttonElement) {
    currentMachineId = machineId;
    
    // ボタンのアクティブ状態を更新
    document.querySelectorAll('.machine-button').forEach(btn => {
        btn.classList.remove('active');
    });
    buttonElement.classList.add('active');
    
    // 商品を読み込む
    loadProducts(machineId);
}

// 商品一覧を読み込む
async function loadProducts(machineId) {
    try {
        const response = await fetch(`/api/products/${machineId}`);
        const products = await response.json();
        
        const productsList = document.getElementById('productsList');
        productsList.innerHTML = '';
        
        if (products.length === 0) {
            productsList.innerHTML = '<p>商品がまだ登録されていません</p>';
            return;
        }
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            let imageHtml = '';
            if (product.image) {
                imageHtml = `<img src="${product.image}" alt="${product.name}">`;
            }
            
            card.innerHTML = `
                ${imageHtml}
                <h3>${product.name}</h3>
                <p>${product.description || ''}</p>
                <div class="product-price">¥${product.price}</div>
            `;
            
            productsList.appendChild(card);
        });
    } catch (error) {
        console.error('エラー:', error);
        document.getElementById('productsList').innerHTML = '<p>エラーが発生しました</p>';
    }
}
