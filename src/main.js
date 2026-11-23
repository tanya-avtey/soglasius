import './styles.scss';
import '@fontsource-variable/montserrat';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  const robot = document.querySelector('.robot');
  const robotImage = robot.querySelector('img');
  let mosaic;
  let mosaicAnimation;
  let cancelled = false;
  const assembleRobot = () => {
    if (cancelled || !robotImage.naturalWidth) return;
    mosaic = document.createElement('div');
    mosaic.className = 'robot-mosaic';
    mosaic.setAttribute('aria-hidden', 'true');
    const pieces = [];
    const columns = 9;
    const rows = 12;
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const piece = document.createElement('span');
        piece.className = 'robot-mosaic-piece';
        piece.style.clipPath = `inset(${row * 100 / rows}% ${(columns - column - 1) * 100 / columns}% ${(rows - row - 1) * 100 / rows}% ${column * 100 / columns}%)`;
        const image = robotImage.cloneNode();
        image.alt = '';
        piece.append(image);
        mosaic.append(piece);
        pieces.push(piece);
      }
    }
    robot.append(mosaic);
    robotImage.style.visibility = 'hidden';
    mosaicAnimation = gsap.from(pieces, {
      x: () => gsap.utils.random(-24, 24),
      y: () => gsap.utils.random(-24, 24),
      opacity: 0,
      duration: 0.7,
      stagger: { each: 0.008, from: 'center' },
      ease: 'power2.out',
      onComplete: () => {
        robotImage.style.visibility = '';
        mosaic.remove();
      },
    });
  };
  if (robotImage.complete) assembleRobot();
  else robotImage.addEventListener('load', assembleRobot, { once: true });

  gsap.utils.toArray('.features li').forEach((card) => {
    if (card.getBoundingClientRect().top < window.innerHeight) return;
    gsap.from(card, {
      y: 14,
      duration: 0.65,
      ease: 'power2.out',
      clearProps: 'transform',
      scrollTrigger: { trigger: card, start: 'top 95%', once: true },
    });
  });
  return () => {
    cancelled = true;
    robotImage.removeEventListener('load', assembleRobot);
    mosaicAnimation?.kill();
    mosaic?.remove();
    robotImage.style.visibility = '';
  };
});

document.querySelectorAll('[data-crop]').forEach((element) => {
  const [x, y, width, height] = element.dataset.crop.split(',');
  Object.entries({ x, y, w: width, h: height }).forEach(([key, value]) =>
    element.style.setProperty(`--${key}`, value),
  );
  const image = new Image();
  image.src = `${import.meta.env.BASE_URL}reference.png`;
  image.alt = '';
  image.draggable = false;
  element.append(image);
});

const roles = {
  business: {
    label: 'Для владельцев сайтов и бизнеса',
    title: 'Согласия под контролем без собственной разработки',
    summary:
      'Для бизнеса Согласиус — это единая точка управления согласиями на всех сайтах и веб-приложениях. Настройте cookie-баннер, загрузите политики и формы согласий, а сервис сохранит факты выбора пользователей и привяжет их к действовавшим версиям документов.',
    features: [
      'Cookie-баннер в фирменном стиле сайта',
      'Документы и согласия в одном месте',
      'Управление несколькими проектами в одном кабинете',
      'Подключение без разработки собственной системы',
      'Аналитика согласий и отказов',
    ],
  },
  privacy: {
    label: 'Для ответственных за персональные данные',
    title: 'История согласий в одном месте',
    summary:
      'Просматривайте выбор пользователей и связанные с ним версии документов в едином журнале подтверждений.',
    features: [
      'Журнал подтверждений',
      'Привязка к версии документа',
      'Управление политиками согласия',
      'История выбора пользователей',
      'Обзор согласий по проектам',
    ],
  },
  developer: {
    label: 'Для разработчиков',
    title: 'Подключение к вашему сайту',
    summary:
      'Создайте проект, настройте баннер и подключите его к сайту. В макете предусмотрены независимое от платформы подключение и модуль для Битрикс.',
    features: [
      'Простой конструктор баннеров',
      'Настройка под дизайн сайта',
      'Модуль для Битрикс',
      'Подключение независимо от платформы',
      'Несколько проектов в одном кабинете',
    ],
  },
  local: {
    label: 'Для локального размещения',
    title: 'Обсудим размещение в вашей инфраструктуре',
    summary:
      'Технические условия локального размещения в исходном макете не указаны. Оставьте демонстрационную заявку, чтобы посмотреть сценарий обращения.',
    features: [
      'Обсуждение требований команды',
      'Выбор способа подключения',
      'Согласование параметров размещения',
    ],
  },
  partner: {
    label: 'Для партнёров',
    title: 'Помогайте клиентам управлять согласиями',
    summary:
      'Подключайте сайты клиентов и настраивайте баннеры под их фирменный стиль. Условия партнёрской программы требуют уточнения.',
    features: [
      'Управление несколькими проектами',
      'Настройка баннеров для клиентов',
      'Помощь с подключением',
      'Единый интерфейс управления',
    ],
  },
};
const tabs = [...document.querySelectorAll('[role="tab"]')];
const tabsContainer = document.querySelector('.tabs');
const rolePanel = document.querySelector('#role-panel');
const mobileRoles = window.matchMedia('(max-width: 760px)');
function selectRole(tab, animate = true) {
  if (!mobileRoles.matches && tab.getAttribute('aria-selected') === 'true' && animate) return;
  tabs.forEach((item) => {
    if (!mobileRoles.matches) item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = mobileRoles.matches || item === tab ? 0 : -1;
    if (mobileRoles.matches) item.setAttribute('aria-expanded', String(item === tab));
  });
  if (mobileRoles.matches) {
    tab.after(rolePanel);
    rolePanel.hidden = false;
  }
  const role = roles[tab.dataset.role];
  const dashboard = document.querySelector('.dashboard');
  dashboard.dataset.role = tab.dataset.role;
  dashboard.querySelector('.dashboard-illustration').setAttribute('aria-label', `Иллюстрация: ${role.label}`);
  document.querySelector('#role-panel').setAttribute('aria-labelledby', tab.id);
  for (const key of ['label', 'title', 'summary'])
    document.querySelector(`#role-${key}`).textContent = role[key];
  document.querySelector('#role-features').replaceChildren(
    ...role.features.map((text) => {
      const listItem = document.createElement('li');
      listItem.textContent = text;
      return listItem;
    }),
  );
  document.querySelector('#role-details').hidden = true;
  document
    .querySelector('#details-toggle')
    .setAttribute('aria-expanded', 'false');
  if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const parts = rolePanel.querySelectorAll('.role-copy, .dashboard');
    gsap.killTweensOf(parts);
    gsap.fromTo(parts, { y: 12 }, {
      y: 0,
      duration: 0.45,
      stagger: 0.06,
      ease: 'power2.out',
      clearProps: 'transform',
      overwrite: true,
    });
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    if (mobileRoles.matches && tab.getAttribute('aria-expanded') === 'true') {
      tab.setAttribute('aria-expanded', 'false');
      rolePanel.hidden = true;
      return;
    }
    selectRole(tab);
  });
  tab.addEventListener('keydown', (event) => {
    if (mobileRoles.matches) return;
    let target;
    if (event.key === 'ArrowRight') target = tabs[(index + 1) % tabs.length];
    if (event.key === 'ArrowLeft')
      target = tabs[(index + tabs.length - 1) % tabs.length];
    if (event.key === 'Home') target = tabs[0];
    if (event.key === 'End') target = tabs.at(-1);
    if (target) {
      event.preventDefault();
      selectRole(target);
      target.focus();
    }
  });
});
function updateRoleLayout() {
  if (mobileRoles.matches) {
    tabsContainer.removeAttribute('role');
    tabs.forEach((tab) => {
      tab.removeAttribute('role');
      tab.removeAttribute('aria-selected');
      tab.setAttribute('aria-expanded', 'false');
      tab.tabIndex = 0;
    });
    rolePanel.removeAttribute('role');
    rolePanel.hidden = true;
  } else {
    tabsContainer.setAttribute('role', 'tablist');
    tabs.forEach((tab) => {
      tab.setAttribute('role', 'tab');
      tab.removeAttribute('aria-expanded');
    });
    tabsContainer.after(rolePanel);
    rolePanel.setAttribute('role', 'tabpanel');
    rolePanel.hidden = false;
    selectRole(tabs[0], false);
  }
}
mobileRoles.addEventListener('change', updateRoleLayout);
updateRoleLayout();
document.querySelector('#details-toggle').addEventListener('click', (event) => {
  const details = document.querySelector('#role-details');
  details.hidden = !details.hidden;
  event.currentTarget.setAttribute('aria-expanded', String(!details.hidden));
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const compactMenu = window.matchMedia('(max-width: 1100px)');
function closeMenu() {
  navigation.classList.remove('is-open');
  navigation.inert = compactMenu.matches;
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
}
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  navigation.inert = !isOpen;
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});
compactMenu.addEventListener('change', closeMenu);
closeMenu();
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a, button')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});

const dialog = document.querySelector('#action-dialog');
const form = document.querySelector('#action-form');
const dialogContent = {
  register: [
    'Попробуйте Согласиус бесплатно',
    '30 дней бесплатно. Без банковской карты.',
  ],
  login: [
    'Вход в Согласиус',
    'Введите почту и пароль для демонстрации формы входа.',
  ],
  contact: [
    'Помощь с подключением',
    'Оставьте имя и почту в демонстрационной форме.',
  ],
  pricing: [
    'Тарифы',
    'В макете указан бесплатный пробный период — 30 дней. Стоимость и условия платных тарифов не предоставлены.',
  ],
};
function openDialog(type) {
  form.reset();
  form.hidden = type === 'pricing';
  form.dataset.mode = type;
  document.querySelector('#dialog-title').textContent = dialogContent[type][0];
  document.querySelector('#dialog-description').textContent =
    dialogContent[type][1];
  document.querySelector('.name-field').hidden = type === 'login';
  document.querySelector('.password-field').hidden = type !== 'login';
  form.elements.password.required = type === 'login';
  form.elements.password.disabled = type !== 'login';
  document.querySelector('#form-result').textContent = '';
  dialog.showModal();
}

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => openDialog(button.dataset.dialog));
});
document
  .querySelector('.dialog-close')
  .addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  }
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  form.hidden = true;
  document.querySelector('#form-result').textContent =
    'Форма заполнена корректно. Это демонстрация: данные не отправлены, сервер авторизации и заявок не подключён.';
});
