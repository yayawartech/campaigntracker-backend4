export const rawQuery = `WITH
	margin1 AS (SELECT * FROM v_spendreport WHERE reportDate = DATE_SUB(CURDATE(), INTERVAL 1 DAY))
SELECT t1.adset_id, t1.daily_budget, t1.status FROM AdSets t1
	JOIN margin1 ON t1.adset_id = margin1.adset_id
WHERE
(TO_DAYS(NOW()) - TO_DAYS(t1.start_time)) < 161
AND t1.daily_budget = 3500
;`;
