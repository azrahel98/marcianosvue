import { h } from 'vue'

const createIcon = (children: any[]) => {
  return (props: any) =>
    h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '24',
        height: '24',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        ...props
      },
      children
    )
}

export const LayoutDashboard = createIcon([
  h('rect', { width: '7', height: '9', x: '3', y: '3', rx: '1' }),
  h('rect', { width: '7', height: '5', x: '14', y: '3', rx: '1' }),
  h('rect', { width: '7', height: '9', x: '14', y: '12', rx: '1' }),
  h('rect', { width: '7', height: '5', x: '3', y: '16', rx: '1' })
])

export const ShoppingBag = createIcon([h('path', { d: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z' }), h('path', { d: 'M3 6h18' }), h('path', { d: 'M16 10a4 4 0 0 1-8 0' })])

export const Gift = createIcon([
  h('rect', { x: '3', y: '8', width: '18', height: '4', rx: '1' }),
  h('path', { d: 'M12 8v13' }),
  h('path', { d: 'M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7' }),
  h('path', { d: 'M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5' })
])

export const ClipboardList = createIcon([
  h('rect', { width: '8', height: '4', x: '8', y: '2', rx: '1', ry: '1' }),
  h('path', { d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' }),
  h('path', { d: 'M12 11h4' }),
  h('path', { d: 'M12 16h4' }),
  h('path', { d: 'M8 11h.01' }),
  h('path', { d: 'M8 16h.01' })
])

export const LogOut = createIcon([
  h('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
  h('polyline', { points: '16 17 21 12 16 7' }),
  h('line', { x1: '21', x2: '9', y1: '12', y2: '12' })
])

export const ChevronRight = createIcon([h('path', { d: 'm9 18 6-6-6-6' })])

export const ChevronDown = createIcon([h('path', { d: 'm6 9 6 6 6-6' })])

export const User = createIcon([h('path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }), h('circle', { cx: '12', cy: '7', r: '4' })])
