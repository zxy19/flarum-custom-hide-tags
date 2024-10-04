<?php

namespace Xypp\CustomHideTags\Filter;
use Flarum\Filter\FilterState;
use Flarum\Query\QueryCriteria;
use Illuminate\Support\Arr;

class DiscussionListFilter
{
    public function __invoke(FilterState $filter, QueryCriteria $queryCriteria)
    {
        if (Arr::has($queryCriteria->query, "tag")) {
            return;
        }
        $actor = $filter->getActor();
        if(!$actor->can('customHideTags.hide')){
            return;
        }
        $hideTags = explode(",", $actor->getPreference("custom_hide_tags", ""));
        $hideTagsId = array_map(fn($tag) => intval($tag), $hideTags);

        if (count($hideTags)) {
            $filter->getQuery()->whereNotExists(function ($query) use ($hideTagsId) {
                $query->selectRaw("1")
                    ->whereColumn('discussions.id', 'discussion_tag.discussion_id')
                    ->from('discussion_tag')
                    ->wherein('discussion_tag.tag_id', $hideTagsId);
            });
        }
    }
}