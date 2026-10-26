'use strict';
'require baseclass';
'require ui';

const ICONS = {
	status: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
	system: '<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
	services: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
	network: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
	vpn: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
	statistics: '<path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/>',
	nas: '<path d="M22 12H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11zM6 16h.01M10 16h.01"/>',
	docker: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7 12 12l8.7-5M12 22V12"/>',
	logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
	_default: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>'
};

function icon(paths, cls) {
	const span = E('span', { 'class': cls || 'nav-icon', 'aria-hidden': 'true' });
	span.innerHTML = '<svg viewBox="0 0 24 24">' + paths + '</svg>';
	return span;
}

return baseclass.extend({
	__init__() {
		this.bindChrome();
		ui.menu.load().then((tree) => this.render(tree));
	},

	render(tree) {
		const mode = this.renderModeMenu(tree);

		if (mode) {
			this.renderMainMenu(mode, mode.name);
			this.renderCrumbs(mode);
		}

		if (L.env.dispatchpath.length >= 3) {
			let node = tree;
			let url = '';

			for (let i = 0; i < 3 && node; i++) {
				node = node.children[L.env.dispatchpath[i]];
				url = url + (url ? '/' : '') + L.env.dispatchpath[i];
			}

			if (node)
				this.renderTabMenu(node, url);
		}
	},

	renderModeMenu(tree) {
		const ul = document.querySelector('#modemenu');
		const children = ui.menu.getChildren(tree);
		let activeMode = null;

		children.forEach((child, index) => {
			const isActive = L.env.requestpath.length
				? child.name === L.env.requestpath[0]
				: index === 0;

			ul.appendChild(E('li', {}, [
				E('a', { 'href': L.url(child.name), 'class': isActive ? 'active' : '' }, [ _(child.title) ])
			]));

			if (isActive)
				activeMode = child;
		});

		if (ul.children.length > 1)
			ul.style.display = '';

		return activeMode;
	},

	renderMainMenu(tree, url) {
		const nav = document.querySelector('#mainmenu');
		const path = L.env.dispatchpath;

		ui.menu.getChildren(tree).forEach(child => {
			const children = ui.menu.getChildren(child);
			const isActive = path[1] == child.name;
			const ico = icon(ICONS[child.name] || ICONS._default, 'nav-icon nav-icon-' + (ICONS[child.name] ? child.name : 'default'));

			if (!children.length) {
				nav.appendChild(E('a', {
					'class': 'nav-link' + (isActive ? ' active' : ''),
					'href': L.url(url, child.name)
				}, [ ico, E('span', {}, [ _(child.title) ]) ]));
				return;
			}

			const sub = E('ul', { 'class': 'nav-sub' }, children.map(item =>
				E('li', {}, [
					E('a', {
						'class': (isActive && path[2] == item.name) ? 'active' : '',
						'href': L.url(url, child.name, item.name)
					}, [ _(item.title) ])
				])
			));

			const group = E('div', { 'class': 'nav-group' + (isActive ? ' open active' : '') }, [
				E('button', {
					'type': 'button',
					'class': 'nav-link nav-trigger',
					'aria-expanded': isActive ? 'true' : 'false',
					'click': (ev) => {
						const open = group.classList.toggle('open');
						ev.currentTarget.setAttribute('aria-expanded', open ? 'true' : 'false');
					}
				}, [
					ico,
					E('span', {}, [ _(child.title) ]),
					icon('<path d="m9 18 6-6-6-6"/>', 'nav-chevron')
				]),
				sub
			]);

			nav.appendChild(group);
		});
	},

	renderCrumbs(mode) {
		const crumbs = document.querySelector('#crumbs');
		const path = L.env.dispatchpath;
		let node = mode;

		for (let i = 1; i < path.length && node; i++) {
			node = node.children?.[path[i]];

			if (!node || !node.title)
				break;

			if (crumbs.children.length)
				crumbs.appendChild(E('span', { 'class': 'crumb-sep' }, [ '/' ]));

			crumbs.appendChild(E('span', { 'class': 'crumb' }, [ _(node.title) ]));
		}
	},

	renderTabMenu(tree, url, level) {
		const container = document.querySelector('#tabmenu');
		const ul = E('ul', { 'class': 'tabs' });
		const children = ui.menu.getChildren(tree);
		let activeNode = null;

		children.forEach(child => {
			const isActive = (L.env.dispatchpath[3 + (level || 0)] == child.name);
			const className = 'tabmenu-item-%s%s'.format(child.name, isActive ? ' active' : '');

			ul.appendChild(E('li', { 'class': className }, [
				E('a', { 'href': L.url(url, child.name) }, [ _(child.title) ])
			]));

			if (isActive)
				activeNode = child;
		});

		if (ul.children.length == 0)
			return E([]);

		container.appendChild(ul);
		container.style.display = '';

		if (activeNode)
			this.renderTabMenu(activeNode, url + '/' + activeNode.name, (level || 0) + 1);

		return ul;
	},

	bindChrome() {
		const body = document.body;
		const root = document.documentElement;

		document.querySelector('#sidebar-toggle')?.addEventListener('click', () => body.classList.toggle('sidebar-open'));
		document.querySelector('#sidebar-backdrop')?.addEventListener('click', () => body.classList.remove('sidebar-open'));

		document.querySelector('#theme-toggle')?.addEventListener('click', () => {
			const dark = root.getAttribute('data-darkmode') !== 'true';
			root.setAttribute('data-darkmode', dark ? 'true' : 'false');
			try { localStorage.setItem('luci-minimal-theme', dark ? 'dark' : 'light'); } catch (e) {}
		});
	}
});
