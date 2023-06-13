SELECT
  cast(`t1`.`start_time` AS date) AS `reportDate`,
  `t1`.`adset_id` AS `adset_id`,
  sum(`t1`.`spend`) AS `adCost`,
  sum(`t1`.`revenue`) AS `revenue`,
(sum(`t1`.`revenue`) - sum(`t1`.`spend`)) AS `profit`,
(
    (
      (sum(`t1`.`revenue`) - sum(`t1`.`spend`)) / sum(`t1`.`revenue`)
    ) * 100
  ) AS `margin`,
  sum(`t1`.`link_clicks`) AS `clicks`,
  `t2`.`daily_budget` AS `daily_budget`,
(to_days(NOW()) - to_days(`t2`.`start_time`)) AS `daysPassed`
FROM
  (
    `tracker`.`dmreporting` `t1`
    LEFT JOIN `tracker`.`adsets` `t2` ON((`t1`.`adset_id` = `t2`.`adset_id`))
  )
GROUP BY
  cast(`t1`.`start_time` AS date),
  `t1`.`adset_id`