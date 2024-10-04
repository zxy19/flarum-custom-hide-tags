import app from 'flarum/forum/app';
import { extend } from "flarum/common/extend";
import SettingsPage from "flarum/forum/components/SettingsPage";
import FieldSet from "flarum/common/components/FieldSet"
import Button from "flarum/common/components/Button";
import TagSelectionModal from "flarum/tags/common/components/TagSelectionModal"
import tagsLabel from "flarum/tags/common/helpers/tagsLabel"
import Tag from "flarum/tags/common/models/Tag";

let savingTags = false;
function selectTags() {
    const tags = (((app.session?.user?.preferences() || {})["custom_hide_tags"] + "") || "")
        .split(",")
        .map(id => app.store.getById<Tag>("tags", id));

    app.modal.show(TagSelectionModal, {
        canSelect: () => true,
        selectedTags: tags,
        onsubmit: (tags: Tag[]) => {
            savingTags = true;
            m.redraw();
            app.session?.user?.savePreferences({
                custom_hide_tags: tags.map(tag => tag.id()).join(",")
            }).then(() => {
                savingTags = false;
                m.redraw();
            });
        }
    });
}

app.initializers.add('xypp/flarum-custom-hide-tags', () => {
    extend(SettingsPage.prototype, 'settingsItems', function (items) {
        if (!app.forum.attribute<boolean>("customHideTags.hide")) return;
        const tags = (((app.session?.user?.preferences() || {})["custom_hide_tags"] + "") || "")
            .split(",")
            .map(id => app.store.getById<Tag>("tags", id));
        items.add(
            'xypp-custom-hide-tags',
            <FieldSet label={app.translator.trans("xypp-custom-hide-tags.forum.hides")}>
                <p>{app.translator.trans("xypp-custom-hide-tags.forum.hides-desc")}</p>
                <div>{tagsLabel(tags)}</div>
                <div>
                    <Button
                        onclick={selectTags}
                        disabled={savingTags}
                        loading={savingTags}
                        className='Button Button--primary'>
                        {app.translator.trans("xypp-custom-hide-tags.forum.hides-select")}
                    </Button>
                </div>
            </FieldSet>
        );
    });
});
