// 全局变量
let currentCategory = 'all';
let currentView = 'home'; // home, list, detail

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderHomePage();
    updateNavActive('home');
});

// 切换移动端菜单
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// 渲染首页
function renderHomePage() {
    // 按日期排序（最新的在前）
    const sortedData = [...articlesData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 渲染头条（最新的一篇文章）
    const latestArticle = sortedData[0];
    const heroContainer = document.getElementById('heroArticle');
    heroContainer.innerHTML = `
        <div class="hero-image">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <div style="font-size: 3rem; margin-bottom: 10px;">📰</div>
                <div style="font-size: 1rem; color: #2c5f2d;">${latestArticle.categoryName}</div>
            </div>
        </div>
        <div class="hero-content">
            <h2>${escapeHtml(latestArticle.title)}</h2>
            <div class="date">${latestArticle.date}</div>
            <div class="excerpt">${escapeHtml(latestArticle.excerpt)}</div>
        </div>
    `;
    heroContainer.onclick = () => showDetail(latestArticle.id);
    
    // 保存当前头条文章ID
    window.currentHeroId = latestArticle.id;
    
    // 渲染各分类列表（每个分类显示前3条）
    renderCategorySection('news', 'newsListHome', sortedData, 3);
    renderCategorySection('research', 'researchListHome', sortedData, 3);
    renderCategorySection('academic', 'academicListHome', sortedData, 3);
    renderCategorySection('practice', 'practiceListHome', sortedData, 3);
}

// 渲染分类区块
function renderCategorySection(category, containerId, data, limit) {
    const container = document.getElementById(containerId);
    const filtered = data.filter(item => item.category === category).slice(0, limit);
    
    if (filtered.length === 0) {
        container.innerHTML = '<li style="color: #999; padding: 20px 0;">暂无内容</li>';
        return;
    }
    
    container.innerHTML = filtered.map(item => `
        <li onclick="showDetail(${item.id})">
            <a onclick="event.preventDefault(); showDetail(${item.id})">
                <span class="title">${escapeHtml(item.title)}</span>
                <span class="date">${item.date}</span>
            </a>
        </li>
    `).join('');
}

// 显示头条详情
function showHeroDetail() {
    if (window.currentHeroId) {
        showDetail(window.currentHeroId);
    }
}

// 筛选分类
function filterByCategory(category) {
    currentCategory = category;
    currentView = 'list';
    
    // 更新导航激活状态
    updateNavActive(category);
    
    // 更新标题
    document.getElementById('listTitle').textContent = categoryMap[category] || '全部资讯';
    
    // 渲染列表
    renderNewsList();
    
    // 显示列表页，隐藏其他页面
    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('listView').classList.remove('hidden');
    document.getElementById('detailView').classList.add('hidden');
    
    // 移动端关闭菜单
    document.getElementById('navMenu').classList.remove('active');
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 更新导航激活状态
function updateNavActive(active) {
    // 移除所有激活状态
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // 添加当前激活状态
    const activeId = {
        'home': 'nav-home',
        'all': 'nav-home',
        'news': 'nav-news',
        'research': 'nav-research',
        'academic': 'nav-academic',
        'field': 'nav-field',
        'practice': 'nav-practice'
    }[active];
    
    if (activeId) {
        const element = document.getElementById(activeId);
        if (element) element.classList.add('active');
    }
}

// 渲染新闻列表
function renderNewsList() {
    const listContainer = document.getElementById('newsList');
    
    // 按日期排序
    let filteredData = [...articlesData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (currentCategory !== 'all') {
        filteredData = filteredData.filter(item => item.category === currentCategory);
    }
    
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

    // 隐藏其他视图
    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('listView').classList.add('hidden');
    document.getElementById('detailView').classList.remove('hidden');
    
    currentView = 'detail';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 返回按钮
function goBack() {
    if (currentView === 'detail') {
        if (currentCategory === 'all' && currentView === 'home') {
            showHome();
        } else {
            showList();
        }
    }
}

// 显示列表页
function showList() {
    currentView = 'list';
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('listView').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 显示首页
function showHome() {
    currentCategory = 'all';
    currentView = 'home';
    updateNavActive('home');
    
    document.getElementById('listView').classList.add('hidden');
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('homeView').classList.remove('hidden');
    
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
