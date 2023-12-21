import { defineStore } from 'pinia';

export const tagsStore = defineStore('tags', {
    // 添加保存状态的数组
    state: () => {
        return {
            visitedViews: [],
            cachedViews: []
        }
    },
    // getters: {
    //     visitedViews: (state) => state.visitedViews,
    //     cachedViews: (state) => state.cachedViews,
    // },
    actions: {
        /**
         * 新增标签
         * @param {*} view tag对象
         * @returns 
         */
        add_visited_view(view) {
            if (this.visitedViews.some(v => v.path === view.path)) return
            this.visitedViews.push(
                Object.assign({}, view, {
                    title: view.meta.title || 'no-name'
                })
            )
        },
        /**
         * 新增页面缓存
         * @param {*} view 
         * @returns 
         */
        add_cached_view(view) {
            if (this.cachedViews.includes(view.name)) return
            // router.meta.noCache为true时不缓存
            if (!view.meta.noCache) {
                this.cachedViews.push(view.name)
            }
        },
        /**
         * 删除已有指定标签
         * @param {*} view 
         */
        del_visited_view(view) {
            for (const [i, v] of this.visitedViews.entries()) {
                if (v.path === view.path) {
                    this.visitedViews.splice(i, 1)
                    break
                }
            }
        },
        del_cached_view(view) {
            const index = this.cachedViews.indexOf(view.name)
            index > -1 && this.cachedViews.splice(index, 1)
        },

        del_others_visited_views(view) {
            this.visitedViews = this.visitedViews.filter(v => {
                return v.meta.affix || v.path === view.path
            })
        },
        del_others_cached_views(view) {
            const index = this.cachedViews.indexOf(view.name)
            if (index > -1) {
                this.cachedViews = this.cachedViews.slice(index, index + 1)
            } else {
                // if index = -1, there is no cached tags
                this.cachedViews = []
            }
        },

        del_all_visited_views() {
            // keep affix tags
            const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
            this.visitedViews = affixTags
        },
        /**
         * 删除所有缓存
         */
        del_all_cached_views() {
            this.cachedViews = []
        },
        /**
         * 更新标签
         * @param {*} view 
         */
        update_visited_view(view) {
            for (let v of this.visitedViews) {
                if (v.path === view.path) {
                    v = Object.assign(v, view)
                    break
                }
            }
        }
    }
});
// export const tagsStore = defineStore(
//     'tags-view',
//     {
//         state: () => ({
//             visitedViews: [],
//             cachedViews: [],
//             // iframeViews: []
//         }),
//         actions: {
//             addView(view) {
//                 this.addVisitedView(view)
//                 this.addCachedView(view)
//             },
//             // addIframeView(view) {
//             //     if (this.iframeViews.some(v => v.path === view.path)) return
//             //     this.iframeViews.push(
//             //         Object.assign({}, view, {
//             //             title: view.meta.title || 'no-name'
//             //         })
//             //     )
//             // },
//             addVisitedView(view) {
//                 if (this.visitedViews.some(v => v.path === view.path)) return
//                 this.visitedViews.push(
//                     Object.assign({}, view, {
//                         title: view.meta.title || 'no-name'
//                     })
//                 )
//             },
//             addCachedView(view) {
//                 if (this.cachedViews.includes(view.name)) return
//                 if (!view.meta.noCache) {
//                     this.cachedViews.push(view.name)
//                 }
//             },
//             delView(view) {
//                 return new Promise(resolve => {
//                     this.delVisitedView(view)
//                     this.delCachedView(view)
//                     resolve({
//                         visitedViews: [...this.visitedViews],
//                         cachedViews: [...this.cachedViews]
//                     })
//                 })
//             },
//             delVisitedView(view) {
//                 return new Promise(resolve => {
//                     for (const [i, v] of this.visitedViews.entries()) {
//                         if (v.path === view.path) {
//                             this.visitedViews.splice(i, 1)
//                             break
//                         }
//                     }
//                     this.iframeViews = this.iframeViews.filter(item => item.path !== view.path)
//                     resolve([...this.visitedViews])
//                 })
//             },
//             // delIframeView(view) {
//             //     return new Promise(resolve => {
//             //         this.iframeViews = this.iframeViews.filter(item => item.path !== view.path)
//             //         resolve([...this.iframeViews])
//             //     })
//             // },
//             delCachedView(view) {
//                 return new Promise(resolve => {
//                     const index = this.cachedViews.indexOf(view.name)
//                     index > -1 && this.cachedViews.splice(index, 1)
//                     resolve([...this.cachedViews])
//                 })
//             },
//             delOthersViews(view) {
//                 return new Promise(resolve => {
//                     this.delOthersVisitedViews(view)
//                     this.delOthersCachedViews(view)
//                     resolve({
//                         visitedViews: [...this.visitedViews],
//                         cachedViews: [...this.cachedViews]
//                     })
//                 })
//             },
//             delOthersVisitedViews(view) {
//                 return new Promise(resolve => {
//                     this.visitedViews = this.visitedViews.filter(v => {
//                         return v.meta.affix || v.path === view.path
//                     })
//                     this.iframeViews = this.iframeViews.filter(item => item.path === view.path)
//                     resolve([...this.visitedViews])
//                 })
//             },
//             delOthersCachedViews(view) {
//                 return new Promise(resolve => {
//                     const index = this.cachedViews.indexOf(view.name)
//                     if (index > -1) {
//                         this.cachedViews = this.cachedViews.slice(index, index + 1)
//                     } else {
//                         this.cachedViews = []
//                     }
//                     resolve([...this.cachedViews])
//                 })
//             },
//             delAllViews(view) {
//                 return new Promise(resolve => {
//                     this.delAllVisitedViews(view)
//                     this.delAllCachedViews(view)
//                     resolve({
//                         visitedViews: [...this.visitedViews],
//                         cachedViews: [...this.cachedViews]
//                     })
//                 })
//             },
//             delAllVisitedViews(view) {
//                 return new Promise(resolve => {
//                     const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
//                     this.visitedViews = affixTags
//                     this.iframeViews = []
//                     resolve([...this.visitedViews])
//                 })
//             },
//             delAllCachedViews(view) {
//                 return new Promise(resolve => {
//                     this.cachedViews = []
//                     resolve([...this.cachedViews])
//                 })
//             },
//             updateVisitedView(view) {
//                 for (let v of this.visitedViews) {
//                     if (v.path === view.path) {
//                         v = Object.assign(v, view)
//                         break
//                     }
//                 }
//             },
//             delRightTags(view) {
//                 return new Promise(resolve => {
//                     const index = this.visitedViews.findIndex(v => v.path === view.path)
//                     if (index === -1) {
//                         return
//                     }
//                     this.visitedViews = this.visitedViews.filter((item, idx) => {
//                         if (idx <= index || (item.meta && item.meta.affix)) {
//                             return true
//                         }
//                         const i = this.cachedViews.indexOf(item.name)
//                         if (i > -1) {
//                             this.cachedViews.splice(i, 1)
//                         }
//                         if (item.meta.link) {
//                             const fi = this.iframeViews.findIndex(v => v.path === item.path)
//                             this.iframeViews.splice(fi, 1)
//                         }
//                         return false
//                     })
//                     resolve([...this.visitedViews])
//                 })
//             },
//             delLeftTags(view) {
//                 return new Promise(resolve => {
//                     const index = this.visitedViews.findIndex(v => v.path === view.path)
//                     if (index === -1) {
//                         return
//                     }
//                     this.visitedViews = this.visitedViews.filter((item, idx) => {
//                         if (idx >= index || (item.meta && item.meta.affix)) {
//                             return true
//                         }
//                         const i = this.cachedViews.indexOf(item.name)
//                         if (i > -1) {
//                             this.cachedViews.splice(i, 1)
//                         }
//                         if (item.meta.link) {
//                             const fi = this.iframeViews.findIndex(v => v.path === item.path)
//                             this.iframeViews.splice(fi, 1)
//                         }
//                         return false
//                     })
//                     resolve([...this.visitedViews])
//                 })
//             }
//         }
//     })

