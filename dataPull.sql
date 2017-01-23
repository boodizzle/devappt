set NOCOUNT ON
SELECT   top 2000    a.appt_id, (select last_name from person where person_id = a.person_Id)as patLast,
(select first_name from person where person_id = a.person_Id)as patFirst,
 (select event from events where events.event_id = a.event_id) as event, a.details,
a.appt_date, a.begintime, a.endtime, a.duration, a.confirm_ind, a.appt_kept_ind, a.cancel_ind,
(select description from provider_mstr where provider_Id = a.rendering_provider_id) as rendering, r.resource_id,r.description AS 'Resource',
a.appt_status, a.resched_ind, (select location_name from location_mstr where location_id = a.location_id) as location, a.appt_type
FROM            appointments a
Left Join appointment_members am
ON a.appt_id = am.appt_id
Left Join Resources r
ON am.resource_id = r.resource_id 
WHERE        (a.practice_id = '0027')
ORDER BY a.appt_date DESC





