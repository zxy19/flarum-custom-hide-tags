<?php

/*
 * This file is part of xypp/flarum-custom-hide-tags.
 *
 * Copyright (c) 2024 小鱼飘飘.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Xypp\CustomHideTags;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Discussion\Filter\DiscussionFilterer;
use Flarum\Extend;
use Flarum\Http\RequestUtil;
use Xypp\CustomHideTags\Filter\DiscussionListFilter;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),
    new Extend\Locales(__DIR__ . '/locale'),
    (new Extend\Filter(DiscussionFilterer::class))
        ->addFilterMutator(DiscussionListFilter::class),
    (new Extend\User)
        ->registerPreference('custom_hide_tags', null, ""),
    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attribute('customHideTags.hide', function (ForumSerializer $serializer) {
            return RequestUtil::getActor($serializer->getRequest())->hasPermission('customHideTags.hide');
        }),
];
