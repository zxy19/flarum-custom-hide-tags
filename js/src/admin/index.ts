import app from 'flarum/admin/app';

app.initializers.add('xypp/flarum-custom-hide-tags', () => {
  app.extensionData.for('xypp-custom-hide-tags')
    .registerPermission(
      {
        icon: 'fas fa-eye-slash',
        label: app.translator.trans('xypp-custom-hide-tags.admin.permissions_hide_tags'),
        permission: 'customHideTags.hide',
      },
      "view"
    );
});
