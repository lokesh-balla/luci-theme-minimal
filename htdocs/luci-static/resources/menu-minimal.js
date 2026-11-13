'use strict';
'require baseclass';
'require ui';

const ICONS = {
	status: '<path d="M3 12h4l3 8l4 -16l3 8h4"/>',
	system: '<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>',
	services: '<path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/>',
	network: '<path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0"/><path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6m0 -12c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6"/><path d="M6 9h12"/><path d="M3 20h7"/><path d="M14 20h7"/><path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M12 15v3"/>',
	vpn: '<path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/>',
	statistics: '<path d="M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -6"/><path d="M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -10"/><path d="M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -14"/><path d="M4 20h14"/>',
	nas: '<path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"/><path d="M3 14m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"/><path d="M7 8v.01"/><path d="M7 18v.01"/><path d="M11 8h6"/><path d="M11 18h6"/>',
	docker: '<path d="M22 12.54c-1.804 -.345 -2.701 -1.08 -3.523 -2.94c-.487 .696 -1.102 1.568 -.92 2.4c.028 .238 -.32 1 -.557 1h-14c0 5.208 3.164 7 6.196 7c4.124 .022 7.828 -1.376 9.854 -5c1.147 -.517 2.19 -1.83 2.75 -3.46z"/><path d="M12 12h.01"/><path d="M15 12h.01"/><path d="M12 9h.01"/><path d="M15 9h.01"/><path d="M9 12h.01"/><path d="M7 12h.01"/><path d="M12 6h.01"/>',
	logout: '<path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"/><path d="M9 12h12l-3 -3"/><path d="M18 15l3 -3"/>',
	modem: '<path d="M6 18l0 -3"/><path d="M10 18l0 -6"/><path d="M14 18l0 -9"/><path d="M18 18l0 -12"/>',
	_default: '<path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"/><path d="M9 4v16"/>'
};

/*
 * Button intents. LuCI's button classes don't reliably say what a button does
 * ("Delete" is sometimes -remove, sometimes -negative; "Restart" is a plain
 * -action), so classify by label instead. Labels go through _() so this keeps
 * working in every language that translates them.
 *
 *   danger   destroys data or cuts connections    -> red
 *   caution  interrupts something temporarily     -> amber
 *   positive starts or enables something          -> green
 *   neutral  opens, edits or inspects             -> plain outline (never solid)
 */
const BUTTON_INTENTS = [
	[ 'danger',   'trash',   [ 'Delete', 'Remove', 'Delete this network', 'Flush' ] ],
	[ 'danger',   'x',       [ 'Kill', 'Terminate', 'Disconnect', 'Unmount', 'Hang Up', 'Perform reset' ] ],
	[ 'danger',   'flash',   [ 'Flash image', 'Flash', 'Continue flashing' ] ],
	[ 'caution',  'rotate',  [ 'Restart', 'Reload', 'Reboot', 'Perform reboot', 'Restart radio interface', 'Reconnect', 'Revert', 'Revert changes' ] ],
	[ 'caution',  'stop',    [ 'Stop', 'Disable', 'Stop WPS' ] ],
	[ 'caution',  'pause',   [ 'Suspend', 'Pause' ] ],
	[ 'positive', 'play',    [ 'Start', 'Enable', 'Connect', 'Start WPS', 'Enable this network' ] ],
	[ 'positive', 'refresh', [ 'Update', 'Update lists', 'Refresh', 'Search for firmware upgrade' ] ],
	[ 'neutral',  'edit',    [ 'Edit', 'Edit this network', 'Configure' ] ],
	[ 'neutral',  'search',  [ 'Scan', 'Find and join network' ] ],
	[ 'neutral',  'x',       [ 'Clear' ] ],
	[ 'neutral',  'copy',    [ 'Clone' ] ],
	[ 'neutral',  'plus',    [ 'Add', 'Add instance', 'Add new entry' ] ],
	[ 'neutral',  'upload',  [ 'Upload', 'Upload Package', 'Upload file', 'Upload archive' ] ],
	[ 'neutral',  'download',[ 'Download', 'Generate archive', 'Download backup' ] ]
];

function normLabel(text) {
	return String(text || '').replace(/[\u2026.\u00bb\s]+$/, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function icon(paths, cls) {
	const span = E('span', { 'class': cls || 'nav-icon', 'aria-hidden': 'true' });
	span.innerHTML = '<svg viewBox="0 0 24 24">' + paths + '</svg>';
	return span;
}

return baseclass.extend({
	__init__() {
		this.bindChrome();
		this.bindButtonIntents();
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
					icon('<path d="M9 6l6 6l-6 6"/>', 'nav-chevron')
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

	bindButtonIntents() {
		const map = new Map();

		BUTTON_INTENTS.forEach(([ intent, glyph, labels ]) => labels.forEach(label => {
			for (const l of [ label, _(label) ])
				if (!map.has(normLabel(l)))
					map.set(normLabel(l), { intent, glyph });
		}));

		const tag = (btn) => {
			const text = btn.tagName == 'INPUT' ? btn.value : btn.textContent;

			if (btn.dataset.intentLabel === text)
				return;

			btn.dataset.intentLabel = text;

			/* exact label first, then the leading verb ("Stop DDNS", "Restart DDns") */
			const label = normLabel(text);
			const hit = map.get(label) || (label.includes(' ') ? map.get(label.split(' ')[0]) : null);

			if (hit) {
				btn.dataset.intent = hit.intent;
				/* inputs can't render ::before, so only buttons get a glyph */
				if (btn.tagName != 'INPUT')
					btn.dataset.icon = hit.glyph;
				else
					delete btn.dataset.icon;
			}
			else {
				delete btn.dataset.intent;
				delete btn.dataset.icon;
			}
		};

		const scan = () => {
			document.querySelectorAll('#maincontent button, #maincontent .btn, #maincontent .cbi-button, #maincontent input[type="button"], #maincontent input[type="submit"], #modal_overlay button, #modal_overlay .btn, #modal_overlay .cbi-button')
				.forEach(btn => {
					if (!btn.classList.contains('cbi-dropdown'))
						tag(btn);
				});
		};

		let queued = false;
		const schedule = () => {
			if (queued)
				return;

			queued = true;
			requestAnimationFrame(() => { queued = false; scan(); });
		};

		new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [ 'value' ] });
		scan();
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
