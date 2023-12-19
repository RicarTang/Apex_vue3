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