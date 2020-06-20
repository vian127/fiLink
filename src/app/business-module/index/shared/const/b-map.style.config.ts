/**
 * 首页地图去掉某些商家图标配置文件
 */
export const BMapStyleConfig = [
  {
    'featureType': 'shopping',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on'
    }
  }, {
    'featureType': 'restaurantlabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'restaurantlabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'entertainmentlabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'entertainmentlabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'shoppinglabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'shoppinglabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'hotellabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'hotellabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }
];
