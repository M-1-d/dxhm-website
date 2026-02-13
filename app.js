// 全局变量
let currentCategory = 'all';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderNewsList();
});

// 切换移动端菜单
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// 渲染新闻列表
function renderNewsList() {
    const listContainer = document.getElementById('newsList');
    const filteredData = currentCategory === 'all' 
        ? articlesData 
        : articlesData.filter(item => item.category === currentCategory);
    
    if (filteredData.length === 0) {
        listContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">暂无相关文章</div>';
        return;
    }
    
    listContainer.innerHTML = filteredData.map(item => `
        <article class="news-item" onclick="showDetail(${item.id})">
            <span class="news-category">${item.categoryName}</span>
            <h3 class="news-title">${escapeHtml(item.title)}</h3>
            <div class="news-meta">${item.date}</div>
            <p class="news-excerpt">${escapeHtml(item.excerpt)}</p>
            <a href="#" class="read-more" onclick="event.stopPropagation(); showDetail(${item.id})">
                阅读更多
            </a>
        </article>
    `).join('');
}

// 筛选分类
function filterByCategory(category) {
    currentCategory = category;
    
    // 更新侧边栏激活状态
    document.querySelectorAll('.category-list a').forEach(link => {
        link.classList.remove('active');
        if(link.dataset.category === category) {
            link.classList.add('active');
        }
    });

    // 更新标题
    document.getElementById('listTitle').textContent = categoryMap[category] || '全部资讯';

    // 显示列表页，隐藏其他页面
    document.getElementById('listView').classList.remove('hidden');
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('aboutView').classList.add('hidden');
    
    renderNewsList();
    
    // 移动端关闭菜单
    document.getElementById('navMenu').classList.remove('active');
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 显示详情页
function showDetail(id) {
    const item = articlesData.find(n => n.id === id);
    if (!item) return;

    document.getElementById('detailCategory').textContent = item.categoryName;
    document.getElementById('detailTitle').textContent = item.title;
    document.getElementById('detailDate').textContent = item.date;
    document.getElementById('detailAuthor').textContent = `来源：${item.author}`;
    document.getElementById('viewCount').textContent = Math.floor(Math.random() * 500) + 50;
    
    let contentHtml = item.content || `<p>${item.excerpt}</p>`;
    
    if (item.image) {
        contentHtml = `
            <div class="media-container">
                <div class="image-wrapper">
                    <img src="${item.image}" alt="${item.title}">
                </div>
            </div>
        ` + contentHtml;
    }

    document.getElementById('detailContent').innerHTML = contentHtml;

    document.getElementById('listView').classList.add('hidden');
    document.getElementById('detailView').classList.remove('hidden');
    document.getElementById('aboutView').classList.add('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 显示列表页
function showList() {
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('listView').classList.remove('hidden');
    document.getElementById('aboutView').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 显示首页
function showHome() {
    filterByCategory('all');
    document.getElementById('navMenu').classList.remove('active');
}

// 显示关于我们
function showAbout() {
    document.getElementById('listView').classList.add('hidden');
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('aboutView').classList.remove('hidden');
    document.getElementById('navMenu').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 工具函数
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
