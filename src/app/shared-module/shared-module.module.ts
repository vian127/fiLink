import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {XcI18nModule} from './service/i18N';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {PaginationComponent} from './component/pagination/pagination.component';
import {ProgressComponent} from './component/progress/progress.component';
import {FormComponent} from './component/form/form.component';
import {TreeNodeComponent} from './component/tree/tree-node.component';
import {TreeComponent} from './component/tree/tree.component';
import {VideoComponent} from './component/video/video.component';
import {TableComponent} from './component/table/table.component';
import {TableSearchComponent} from './component/table/table-search/table-search.component';
import {TreeSelectorComponent} from './component/tree-selector/tree-selector.component';
import {SelectorComponent} from './component/selector/selector.component';
import {FilinkMenuComponent} from './component/filink-menu/filink-menu.component';
import {MapSelectorComponent} from './component/map-selector/map-selector.component';
import {BreadcrumbComponent} from './component/breadcrumb/breadcrumb.component';
import {RouterModule} from '@angular/router';
import {DetailTitleComponent} from './component/detail-title/detail-title.component';
import {DatePickerComponent} from './component/date-picker/date-picker.component';
import {MapComponentComponent} from './component/map-selector/map-component/map-component.component';
import {TreeAreaSelectorComponent} from './component/tree-area-selector/tree-area-selector.component';
import {FiLinkModalService} from './service/filink-modal/filink-modal.service';
import {MD5Service} from './util/md5.service';
import {MapComponent} from './component/map/map.component';
import {DynamicPipe} from './pipe/dynamic.pipe';
import {CheckSelectInputComponent} from './component/check-select-input/check-select-input.component';
import {TelephoneInputComponent} from './component/telephone-input/telephone-input.component';
import {BsDropdownModule} from 'ngx-bootstrap';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {Download} from './util/download';
import {AccessPermissionDirective} from './directive/access-permission.directive';
import {ProgressBarDirective} from './directive/progress-bar.directive';
import {ImageViewComponent} from './component/image-view/image-view.component';
import {PhotoInfoComponent} from './component/image-view/photo-info/photo-info.component';
import {TableVirtualComponent} from './component/table/table-virtual/table-virtual.component';
import {ImageViewService} from './service/picture-view/image-view.service';
import {TreeRoleSelectorComponent} from './component/tree-role-selector/tree-role-selector.component';
import {SelectValuePipe} from './pipe/selectValue.pipe';
import {RuleUtil} from './util/rule-util';
import {MapSelectorInspectionComponent} from './component/map-selector/map-selector-inspection/map-selector-inspection.component';
import {BusinessTemplateComponent} from './component/business-template/business-template.component';
import {AddTemplateComponent} from './component/business-template/add-template/add-template.component';
import {BoxTemplateComponent} from './component/business-template/box-template/box-template.component';
import {TemplateSearchComponent} from './component/business-template/template-search/template-search.component';
import {FrameTemplateComponent} from './component/business-template/frame-template/frame-template.component';
import {BoardTemplateComponent} from './component/business-template/board-template/board-template.component';
import {ExportMessagePushComponent} from './component/export-message-push/export-message-push.component';
import {ExportMessagePushService} from './service/message-push/message-push.service';
import {BusinessPictureComponent} from './component/business-picture/business-picture.component';
import {CityPickerComponent} from './component/city-picker/city-picker.component';
import {DeviceTypePipe} from './pipe/device-type.pipe';
import {SearchInputComponent} from './component/search-input/search-input.component';
import {FormConfigService} from './component/business-template/form-config.service';
import {NavigationTranslatePipe} from './pipe/navigation-translate.pipe';
import {DrawTemplateService} from './component/business-template/draw-template.service';
import {AlarmNameComponent} from './component/alarm/alarm-name/alarm-name.component';
import {AreaComponent} from './component/alarm/area/area.component';
import {AlarmObjectComponent} from './component/alarm/alarm-object/alarm-object.component';
import {UserComponent} from './component/alarm/user/user.component';
import {UnitComponent} from './component/alarm/unit/unit.component';
import {AlarmContinueTimeComponent} from './component/alarm/alarm-continue-time/alarm-continue-time.component';
import {XcNzSelectModule} from './component/select';
import {AudioComponent} from './component/audio/audio.component';
import {AudioMusicService} from './service/audio-music/audio-music.service';
import {NoticeMusicService} from './util/notice-music.service';
import {CreateWorkOrderComponent} from './component/alarm/create-work-order/create-work-order.component';
import {StatisticalSliderComponent} from './component/statistical-slider/statistical-slider.component';
import {BusinessFrameComponent} from './component/business-frame/business-frame.component';
import {DeviceObjectComponent} from './component/core-fusion/device-object.component';
import {BusinessFacilityService} from './service/business-facility/business-facility.service';
import {BusinessTemplateService} from './component/business-template/business-template.service';
import {AsyncRuleUtil} from './util/async-rule-util';
import {TreeListSelectorComponent} from '../business-module/work-order/inspection/tree-selector/tree-selector.component';
import {SerialNumberPipe} from './pipe/serial-number.pipe';
import {EquipmentBulkOperationsComponent} from './component/business-component/equipment-bulk-operations/equipment-bulk-operations.component';
import {DynamicRenderComponent} from './component/dynamic-render/dynamic-render.component';
import {DynamicRenderDirective} from './component/dynamic-render/dynamic-render.directive';
import { TableHeaderComponent } from './component/table/table-header/table-header.component';
// import {MapEquipmentComponentComponent} from '../business-module/work-order/inspection/map-selector/map-equipment-component/map-equipment-component.component';
// import {MapEquipmentSelectorComponent} from '../business-module/work-order/inspection/map-selector/map-equipment-selector.component';
// import {MapEquipmentSelectorInspectionComponent} from '../business-module/work-order/inspection/map-selector/map-equipment-selector-inspection/map-equipment-selector-inspection.component';
import { TroubleSuggestComponent } from './component/trouble-suggest/trouble-suggest.component';
import {NgxEchartsModule} from 'ngx-echarts';
import { SliderControlComponent } from './component/dynamic-render/dynamic-component-repository/slider-control/slider-control.component';
import { UploadComponentComponent } from './component/upload-component/upload-component.component';

const COMPONENT = [
  PaginationComponent,
  ProgressComponent,
  FormComponent,
  TreeNodeComponent,
  TreeComponent,
  VideoComponent,
  TableComponent,
  TableSearchComponent,
  SelectorComponent,
  TreeSelectorComponent,
  TreeListSelectorComponent,
  FilinkMenuComponent,
  MapSelectorComponent,
  BreadcrumbComponent,
  DetailTitleComponent,
  DatePickerComponent,
  MapComponentComponent,
  TreeAreaSelectorComponent,
  MapComponent,
  CheckSelectInputComponent,
  TelephoneInputComponent,
  ImageViewComponent,
  PhotoInfoComponent,
  TableVirtualComponent,
  TreeRoleSelectorComponent,
  BusinessTemplateComponent,
  AddTemplateComponent,
  MapSelectorInspectionComponent,
  BoxTemplateComponent,
  TemplateSearchComponent,
  FrameTemplateComponent,
  BoardTemplateComponent,
  ExportMessagePushComponent,
  BusinessPictureComponent,
  CityPickerComponent,
  SearchInputComponent,
  AlarmNameComponent,
  AreaComponent,
  AlarmObjectComponent,
  DeviceObjectComponent,
  UserComponent,
  UnitComponent,
  AlarmContinueTimeComponent,
  AudioComponent,
  CreateWorkOrderComponent,
  StatisticalSliderComponent,
  BusinessFrameComponent,
  DynamicRenderComponent,
  // MapEquipmentComponentComponent,
  // MapEquipmentSelectorComponent,
  // MapEquipmentSelectorInspectionComponent,
  UploadComponentComponent
];

@NgModule({
    imports: [
        BsDropdownModule.forRoot(),
        CommonModule,
        FormsModule,
        XcI18nModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ScrollingModule,
        RouterModule,
        XcNzSelectModule,
        NgxEchartsModule
    ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    AccessPermissionDirective,
    ProgressBarDirective,
    ...COMPONENT,
    DynamicPipe,
    DeviceTypePipe,
    NavigationTranslatePipe,
    XcNzSelectModule,
    EquipmentBulkOperationsComponent,
    TroubleSuggestComponent
  ],
  providers: [FiLinkModalService, MD5Service, Download, ImageViewService,
    ExportMessagePushService, RuleUtil, AsyncRuleUtil, FormConfigService, DrawTemplateService,
    AudioMusicService, NoticeMusicService, BusinessFacilityService, BusinessTemplateService],
  declarations: [...COMPONENT, DynamicPipe, SelectValuePipe,
    AccessPermissionDirective, ProgressBarDirective, DynamicRenderDirective,
    DeviceTypePipe, NavigationTranslatePipe, BusinessFrameComponent,
    SerialNumberPipe, EquipmentBulkOperationsComponent, TableHeaderComponent,
    TroubleSuggestComponent, SliderControlComponent],
  entryComponents: [...COMPONENT, ProgressComponent]
})

export class SharedModule {
}
