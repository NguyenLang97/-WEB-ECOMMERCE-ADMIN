import React from 'react'

const ConvertCategory = (category: string) => {
    switch (category) {
        case 'laptop':
            return 'Laptop'
        case 'phone':
            return 'Điện thoại'
        case 'camera':
            return 'Camera'
        case 'displaycard':
            return 'Cart màn hình'
        case 'screen':
            return 'Màn hình'
        case 'keyboard':
            return 'Bàn phím'
        case 'mouse':
            return 'Chuột'
        case 'harddrive':
            return 'Ổ cứng'

        default:
            break
    }
}

export default ConvertCategory
