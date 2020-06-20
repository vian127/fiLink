import {Component, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfigService} from '../../column-config.service';
import {MenuManageService} from '../../../../core-module/api-service/system-setting';
import {Result} from '../../../../shared-module/entity/result';
import {ActivatedRoute, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {BasicConfig} from '../../../basic-config';
import {ThreeViewMenuComponent} from '../left-view-menu/three-menu/three-view-menu.component';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';


@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-add.component.html',
  styleUrls: ['./menu-add.component.scss']
})
export class MenuAddComponent extends BasicConfig implements OnInit {
  // 菜单树模板
  @ViewChild('menuTree') private menuTreeTemplate;
  // 树
  @ViewChild('tree') private tree;
  // 三级菜单模板
  @ViewChild('threeMenu') private threeViewMenu: ThreeViewMenuComponent;
  // 页面title
  public pageTitle: string;
  // 当前模板id
  public templateId: '';
  // 当前模板版本
  public version: 1;
  // 树数据
  public treeData: any;
  // 主页面菜单配置
  public menuNodeList = [];
  // 三级菜单路由配置
  public threeMenuInfo = {menuName: '', children: []};
  // 是否显示
  public isVisible: boolean = false;
  // 国际化
  public indexLanguage: IndexLanguageInterface;

  constructor(
    public $nzI18n: NzI18nService,
    private $columnConfigService: ColumnConfigService,
    private $systemSettingService: MenuManageService,
    private $activatedRoute: ActivatedRoute,
    private $message: FiLinkModalService,
    private $router: Router
  ) {
    super($nzI18n);
    this.pageTitle = this.language.systemSetting.menuAdd;
  }

  ngOnInit() {
    this.indexLanguage =  this.$nzI18n.getLocaleData('index');
    // 根据id是否在  判断是新增还是修改页面
    this.$activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.templateId = params.id;
        this.pageTitle = this.language.systemSetting.menuUpdate;
        this.$systemSettingService.getMenuTemplateByMenuTemplateId(params.id).subscribe((result: Result) => {
          if (result.code === 0) {
            const {menuInfoTrees, remark, templateName, templateStatus, version} = result.data;
            this.version = version;
            const initData = {
              remark,
              templateName,
              templateStatus,
              menuTreeTemplate: this.menuTreeTemplate,
              menuTemplateId: this.templateId,
            };
            this.formColumn = this.$columnConfigService.getSystemSettingAddColumn(initData);
            this.dealTree(menuInfoTrees);
            this.treeData = menuInfoTrees;
          } else {
            this.$message.error(result.msg);
            this.cancel();
          }
        });
      } else {
        // 初始化表单
        const initData = {
          menuTreeTemplate: this.menuTreeTemplate
        };
        this.formColumn = this.$columnConfigService.getSystemSettingAddColumn(initData);
        this.$systemSettingService.getDefaultMenuTemplate().subscribe((result: Result) => {
          if (result.code === 0) {
            const menuInfoTrees = result.data;
            this.dealTree(menuInfoTrees);
            this.treeData = menuInfoTrees;
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });
  }

  /**
   * 新增菜单模板
   */
  addMenuTemplate() {
    const data = this.formStatus.getData();
    data.menuInfoTrees = this.tree.getTree();
    this.submitLoading = true;
    this.$systemSettingService.addMenuTemplate(data).subscribe((result: Result) => {
      this.submitLoading = false;
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.cancel();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.submitLoading = false;
    });

  }

  /**
   * 更新模板信息
   */
  updateMenuTemplate() {
    const data = this.formStatus.getData();
    data.menuInfoTrees = this.tree.getTree();
    data.menuTemplateId = this.templateId;
    data.version = this.version;
    this.submitLoading = true;
    this.$systemSettingService.updateMenuTemplate(data).subscribe((result: Result) => {
      this.submitLoading = false;
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.cancel();
      } else {
        this.$message.warning(result.msg);
      }
    }, () => {
      this.submitLoading = false;
    });
  }

  /**
   * 取消按钮
   */
  cancel() {
    this.$router.navigate(['/business/system/menu']).then();
  }

  /**
   * 处理树结构
   * param treeNode
   */
  dealTree(treeNode) {
    for (let i = 0; i < treeNode.length; i++) {
      // 翻译菜单树
      treeNode[i].menuName = this.$nzI18n.translate(`navigation.${treeNode[i].menuId}`);
      if (treeNode[i].children && treeNode[i].children.length > 0) {
        this.dealTree(treeNode[i].children);
      } else {
        treeNode[i].isLeaf = true;
      }
    }
  }

  /**
   * 显示三级菜单
   * param item
   */
  showThreeMenu(item) {
    if (this.threeViewMenu) {
      this.threeViewMenu.isShow = true;
    }
    this.threeMenuInfo = item;
  }

  /**
   * 预览菜单
   */
  showMenu() {
    // 获取菜单配置
    setTimeout(() => {
      this.menuNodeList = this.tree.getTree();
      console.log(this.menuNodeList);
    }, 0);
    this.isVisible = true;
  }

  /**
   * 确定
   */
  handleCancel() {
    this.isVisible = false;
    this.menuNodeList = [];
    this.threeMenuInfo = {menuName: '', children: []};
  }
}
