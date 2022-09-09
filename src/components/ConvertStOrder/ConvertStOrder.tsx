const ConvertStOrder = (category: string) => {
    switch (category) {
        case 'Success':
            return 'Đặt hàng thành công'
        case 'Delivery':
            return 'Đang vận chuyển'
        case 'Confirm':
            return 'Đã nhận hàng'

        default:
            break
    }
}

export default ConvertStOrder
