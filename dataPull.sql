select * from appointments


select appt_id, event_id, person_id, 
appt_date, begintime, endtime,duration,
last_name, first_name, middle_Name, description, details,
zip, home_phone, rendering_provider_id, workflow_status,
appt_type
from appointments


select count(*) from appointments where practice_id = '0027';
select count(*) from appointment_members where practice_id = '0027';
select * from resources

select * from appointment_members --links resources && appointments