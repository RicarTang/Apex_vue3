import moment from 'moment'
import { boolToStrEnum } from '@/utils/enum'

/**
 * 格式化tableData
 * @param {Array} data 原数据
 * @param {Array} enumFormatField  需要格式化enum的字段组成的数组
 * @returns 
 */
export function formatTableData(data, enumFormatField) {
  const formatData = data.map((item) => {
    // 格式化日期时间
    item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
    item.update_at = moment(item.update_at).format('YYYY-MM-DD HH:mm:ss')
    // 格式化枚举
    if (enumFormatField) {
      enumFormatField.forEach((field) => {
        if (!item.hasOwnProperty(field)) {
          throw new Error(`属性 ${field} 不存在于item对象中`);
        }
        item[field] = boolToStrEnum[item[field]] || '未知';
      })
    }
    // 为每条item添加自己的loading
    item.loading = false;
    // 返回每条item组成新的数组
    return item
  })
  return formatData
}